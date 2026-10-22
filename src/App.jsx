import { useEffect, useMemo, useReducer, useState } from "react";
import { useTideCloak } from "@tidecloak/react";
import seed from "./seed.json";

const initialPanel = seed.panel;
const demoRegistrar = seed.adminActor;

const actionNames = {
  force: "Grant emergency access / Force approve",
  jump: "Prioritise in queue",
  remove: "Revoke participant access",
  panel: "Change 2-of-3 approver panel",
};

function audit(state, actor, action, reason) {
  return {
    ...state,
    audit: [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toISOString(),
        actor,
        action,
        reason,
      },
      ...state.audit,
    ],
  };
}

function applyApprovedAction(state, request) {
  if (request.kind === "panel") {
    return {
      ...state,
      panel: [
        ...state.panel.filter((member) => member.id !== request.replaceMember.id),
        request.candidate,
      ],
    };
  }

  const courses = state.courses.map((course) => {
    if (course.id !== request.courseId) return course;
    const enrolled = course.enrolled.filter((id) => id !== request.studentId);
    const waitlist = course.waitlist.filter((id) => id !== request.studentId);
    if (request.kind === "force") {
      return { ...course, enrolled: [...enrolled, request.studentId], waitlist };
    }
    if (request.kind === "jump") {
      return { ...course, enrolled, waitlist: [request.studentId, ...waitlist] };
    }
    return { ...course, enrolled, waitlist };
  });
  return { ...state, courses };
}

function reducer(state, event) {
  if (event.type === "enrol") {
    const course = state.courses.find((item) => item.id === event.courseId);
    if (
      course.enrolled.includes(event.studentId) ||
      course.waitlist.includes(event.studentId)
    ) {
      return state;
    }
    const hasSeat = course.enrolled.length < course.capacity;
    const courses = state.courses.map((item) =>
      item.id !== course.id
        ? item
        : hasSeat
          ? { ...item, enrolled: [...item.enrolled, event.studentId] }
          : { ...item, waitlist: [...item.waitlist, event.studentId] },
    );
    return audit(
      { ...state, courses },
      event.actor,
      hasSeat ? "Access granted" : "Added to pending queue",
      hasSeat
        ? `${event.studentName} granted standard access to ${course.code}.`
        : `${event.studentName} placed in ${course.code} FIFO waiting list.`,
    );
  }

  if (event.type === "capacity") {
    const courses = state.courses.map((course) =>
      course.id === event.courseId
        ? { ...course, capacity: Math.max(1, Number(event.capacity) || 1) }
        : course,
    );
    const course = state.courses.find((item) => item.id === event.courseId);
    return audit(
      { ...state, courses },
      event.actor,
      "Policy quota updated",
      `${course.code} quota limit set to ${event.capacity}.`,
    );
  }

  if (event.type === "blocked") {
    return audit(state, event.actor, "Blocked unilateral admin override", event.reason);
  }

  if (event.type === "request") {
    const request = {
      ...event.request,
      approvals: [],
      status: "pending",
      id: `${Date.now()}-${Math.random()}`,
    };
    return audit(
      { ...state, requests: [request, ...state.requests] },
      request.requester,
      `${actionNames[request.kind]} requested`,
      request.reason,
    );
  }

  if (event.type === "vote") {
    const request = state.requests.find((item) => item.id === event.requestId);
    if (!request || request.status !== "pending") return state;
    if (
      request.requester === event.approver.name ||
      !state.panel.some((member) => member.id === event.approver.id) ||
      request.approvals.some((member) => member.id === event.approver.id)
    ) {
      return audit(
        state,
        event.approver.name,
        "Approval blocked",
        "Requester cannot approve their own request; panel members may vote only once.",
      );
    }
    const approvals = [...request.approvals, event.approver];
    let next = audit(
      {
        ...state,
        requests: state.requests.map((item) =>
          item.id === request.id ? { ...item, approvals } : item,
        ),
      },
      event.approver.name,
      "Quorum signature recorded",
      `Approval ${approvals.length} of 2 for ${actionNames[request.kind].toLowerCase()}: ${request.reason}`,
    );
    if (approvals.length >= 2) {
      const approvedRequest = { ...request, approvals };
      next = applyApprovedAction(next, approvedRequest);
      next = {
        ...next,
        requests: next.requests.map((item) =>
          item.id === request.id ? { ...item, approvals, status: "approved" } : item,
        ),
      };
      next = audit(
        next,
        "TideCloak Quorum Policy",
        "Emergent Authority unlocked & applied",
        `${actionNames[request.kind]} approved by ${approvals.map((member) => member.name).join(" and ")}. Public reason: ${request.reason}`,
      );
    }
    return next;
  }

  if (event.type === "deny") {
    const request = state.requests.find((item) => item.id === event.requestId);
    if (!request || request.status !== "pending") return state;
    return audit(
      {
        ...state,
        requests: state.requests.map((item) =>
          item.id === request.id ? { ...item, status: "denied" } : item,
        ),
      },
      event.actor,
      "Quorum request denied",
      `${event.reason} Request reason: ${request.reason}`,
    );
  }

  return state;
}

function personName(state, id) {
  return state.students.find((student) => student.id === id)?.name ?? id;
}

export default function App() {
  const {
    authenticated,
    isInitializing,
    isLoading,
    initError,
    login,
    logout,
    hasRealmRole,
    getValueFromToken,
    doEncrypt,
    doDecrypt,
  } = useTideCloak();

  const [state, dispatch] = useReducer(reducer, {
    courses: seed.courses,
    students: seed.students,
    panel: initialPanel,
    requests: [],
    audit: [],
  });

  const [role, setRole] = useState("student");
  const [studentId, setStudentId] = useState(seed.students[0].id);
  const [approverId, setApproverId] = useState(initialPanel[0].id);
  const [selectedCourse, setSelectedCourse] = useState(seed.courses[0].id);
  const [requestKind, setRequestKind] = useState("force");
  const [targetStudent, setTargetStudent] = useState(seed.students[3].id);
  const [reason, setReason] = useState(
    "Emergency clinical / operational necessity requires 2-of-3 quorum unlock.",
  );
  const [panelCandidate, setPanelCandidate] = useState(demoRegistrar.id);
  const [panelRemoval, setPanelRemoval] = useState(initialPanel[2].id);
  const [unlockedIds, setUnlockedIds] = useState({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (location.pathname === "/auth/redirect" && !isInitializing) {
      history.replaceState(null, "", "/");
    }
  }, [isInitializing]);

  const activeApprover =
    state.panel.find((member) => member.id === approverId) ?? state.panel[0];
  const actor =
    role === "registrar"
      ? demoRegistrar
      : role === "approver"
        ? activeApprover
        : state.students.find((student) => student.id === studentId);
  const isAlreadyEnrolled = (course, id) => course.enrolled.includes(id);

  const ownWaitlists = useMemo(
    () =>
      state.courses
        .map((course) => ({
          course,
          position: course.waitlist.indexOf(studentId) + 1,
        }))
        .filter((item) => item.position > 0),
    [state.courses, studentId],
  );

  function submitRequest(event) {
    event.preventDefault();
    const base = {
      kind: requestKind,
      requester: actor.name,
      reason: reason.trim(),
    };
    if (!base.reason) return;
    if (requestKind === "panel") {
      const candidate =
        panelCandidate === demoRegistrar.id
          ? {
              id: demoRegistrar.id,
              name: demoRegistrar.name,
              title: demoRegistrar.title,
            }
          : state.students.find((student) => student.id === panelCandidate);
      const replaceMember = state.panel.find((member) => member.id === panelRemoval);
      if (!candidate || !replaceMember) return;
      dispatch({ type: "request", request: { ...base, candidate, replaceMember } });
    } else {
      dispatch({
        type: "request",
        request: { ...base, courseId: selectedCourse, studentId: targetStudent },
      });
    }
    setNotice("Protected request added to the public log and awaiting 2-of-3 quorum.");
  }

  function attemptRegistrarOverrides() {
    dispatch({
      type: "blocked",
      actor: demoRegistrar.name,
      reason:
        "SysAdmin cannot unilaterally unlock protected records or bypass queue order; actions require a 2-of-3 quorum.",
    });
    dispatch({
      type: "blocked",
      actor: demoRegistrar.name,
      reason:
        "SysAdmin cannot modify the approver panel alone; governance changes require two independent approver signatures.",
    });
    setNotice("Both unilateral admin override attempts were blocked and logged.");
  }

  function joinCourse(course) {
    dispatch({
      type: "enrol",
      courseId: course.id,
      studentId,
      studentName: personName(state, studentId),
      actor: actor.name,
    });
    setNotice("Access request or FIFO waitlist position recorded.");
  }

  async function toggleDecryptPreview(course) {
    if (unlockedIds[course.id]) {
      setUnlockedIds((prev) => ({ ...prev, [course.id]: false }));
      return;
    }
    // If connected to live TideCloak with E2EE tags configured, invoke SDK doEncrypt/doDecrypt
    if (authenticated && typeof doEncrypt === "function" && typeof doDecrypt === "function") {
      try {
        const encrypted = await doEncrypt([
          { data: course.decryptedNote, tags: [course.tag] },
        ]);
        const decrypted = await doDecrypt([
          { encrypted: encrypted[0], tags: [course.tag] },
        ]);
        if (decrypted && decrypted[0]) {
          setUnlockedIds((prev) => ({ ...prev, [course.id]: true }));
          setNotice(`Decrypted tag "${course.tag}" via live TideCloak enclave.`);
          return;
        }
      } catch {
        // Fall through to demo simulation check below
      }
    }
    setUnlockedIds((prev) => ({ ...prev, [course.id]: true }));
    setNotice(`Simulated client-side tag unlock for "${course.tag}".`);
  }

  async function startLogin() {
    try {
      await login();
    } catch (error) {
      setNotice(
        `TideCloak login could not start: ${error instanceof Error ? error.message : String(error)}. Check that TideCloak is running at localhost:8080.`,
      );
    }
  }

  if (isInitializing) return <main className="loading">Connecting to TideCloak…</main>;

  const tokenName = authenticated
    ? getValueFromToken("name") || getValueFromToken("preferred_username")
    : "";
  const hasRegistrarRole =
    authenticated && (hasRealmRole("registrar") || hasRealmRole("admin"));
  const hasApproverRole = authenticated && hasRealmRole("approver");

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">{seed.appMeta.brandMark}</span>{" "}
          {seed.appMeta.brandName}
        </a>
        <div className="top-actions">
          <span className={`auth-state ${authenticated ? "connected" : ""}`}>
            <i />{" "}
            {authenticated
              ? `TideCloak · ${tokenName || "signed in"}`
              : "TideCloak · not signed in"}
          </span>
          {authenticated ? (
            <button className="button quiet" onClick={logout}>
              Log out
            </button>
          ) : (
            <button className="button dark" onClick={startLogin} disabled={isLoading}>
              {isLoading ? "Starting login…" : "Log in with TideCloak"}
            </button>
          )}
        </div>
      </header>

      <section className="hero">
        <div>
          <div className="eyebrow">
            <span /> {seed.appMeta.eyebrow}
          </div>
          <h1>
            {seed.appMeta.headlineLine1}
            <br />
            {seed.appMeta.headlineLine2}
          </h1>
          <p>{seed.appMeta.subtitle}</p>
        </div>
        <div className="hero-card">
          <span className="card-kicker">THE PROMISE</span>
          <strong>
            No single person
            <br />
            can override the rules.
          </strong>
          <div className="avatar-stack">
            {state.panel.map((member, index) => (
              <span key={member.id} className={`avatar a${index}`}>
                {member.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(-2)
                  .join("")}
              </span>
            ))}
          </div>
          <small>Approver panel · 2 of 3 required</small>
        </div>
      </section>

      <div className="demo-warning">
        <span>DEMO MODE</span>
        TideCloak login is real when configured. The role switcher and 2-of-3 quorum flow below are local simulations ready to customize for your hackathon use case.
      </div>
      {initError && (
        <div className="notice login-error" role="alert">
          TideCloak initialization notice: {initError.message}. Run TideCloak at
          localhost:8080 and place tidecloak.json in public/ to enable live login.
        </div>
      )}

      <section className="toolbar">
        <div>
          <label htmlFor="role">VIEW AS</label>
          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="student">User / Participant</option>
            <option value="registrar">System Admin</option>
            <option value="approver">Approver Panel</option>
          </select>
          {role === "student" && (
            <select
              aria-label="Demo participant"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
            >
              {state.students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          )}
          {role === "approver" && (
            <select
              aria-label="Demo approver"
              value={activeApprover?.id ?? ""}
              onChange={(event) => setApproverId(event.target.value)}
            >
              {state.panel.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} · {member.title}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="role-hint">
          {authenticated
            ? `Tide roles: ${hasRegistrarRole ? "admin " : ""}${hasApproverRole ? "approver" : ""}${!hasRegistrarRole && !hasApproverRole ? "participant / no unilateral admin role" : ""}`
            : "Sign in to view your TideCloak identity and realm roles."}
        </div>
      </section>

      {notice && (
        <div className="notice" role="status">
          {notice}
          <button aria-label="Dismiss notice" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}

      {role === "student" && (
        <section className="section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">PARTICIPANT DASHBOARD</div>
              <h2>Protected vaults &amp; access queues</h2>
            </div>
            <span className="count-pill">{state.courses.length} protected vaults</span>
          </div>
          {ownWaitlists.length > 0 && (
            <div className="position-card">
              <strong>Your pending queue positions</strong>
              {ownWaitlists.map(({ course, position }) => (
                <span key={course.id}>
                  {course.code} <b>#{position}</b>
                </span>
              ))}
            </div>
          )}
          <div className="course-grid">
            {state.courses.map((course) => {
              const already = isAlreadyEnrolled(course, studentId);
              const position = course.waitlist.indexOf(studentId) + 1;
              const available = Math.max(0, course.capacity - course.enrolled.length);
              const isUnlocked = Boolean(unlockedIds[course.id]);
              return (
                <article className="course-card" key={course.id}>
                  <div className="course-top">
                    <span className="course-code">
                      {course.code} · _tide_{course.tag}
                    </span>
                    <span className={available ? "seats open" : "seats full"}>
                      {available ? `${available} slots open` : "Quorum gated"}
                    </span>
                  </div>
                  <h3>{course.name}</h3>
                  <div className="course-stats">
                    <span>
                      Authorized <b>{course.enrolled.length}/{course.capacity}</b>
                    </span>
                    <span>
                      Pending <b>{course.waitlist.length}</b>
                    </span>
                  </div>
                  {already && (
                    <div className="queue-status enrolled">
                      {isUnlocked ? course.decryptedNote : course.encryptedPreview}
                      <small>
                        <button
                          type="button"
                          className="button quiet"
                          style={{ padding: "4px 0", fontSize: "10px" }}
                          onClick={() => toggleDecryptPreview(course)}
                        >
                          {isUnlocked ? "Lock ciphertext" : "Decrypt with Tide tag"}
                        </button>
                      </small>
                    </div>
                  )}
                  {position > 0 ? (
                    <div className="queue-status">
                      You’re #{position} in the queue{" "}
                      <small>Requires slot availability or 2-of-3 quorum exception.</small>
                    </div>
                  ) : already ? null : (
                    <button
                      className="button dark full-width"
                      onClick={() => joinCourse(course)}
                    >
                      {available ? "Request standard access" : "Join pending queue"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
          <div className="section-heading subheading">
            <div>
              <div className="eyebrow">PUBLIC EXCEPTIONS</div>
              <h2>Quorum-approved overrides</h2>
            </div>
          </div>
          <div className="reason-list">
            {state.requests
              .filter((request) => request.status === "approved")
              .map((request) => (
                <div className="reason-item" key={request.id}>
                  <span className="approved-tag">2/3 APPROVED</span>
                  <div>
                    <strong>{actionNames[request.kind]}</strong>
                    <p>{request.reason}</p>
                  </div>
                </div>
              ))}
            {!state.requests.some((request) => request.status === "approved") && (
              <p className="empty">
                No exceptions approved yet. Standard policy rules remain untouched.
              </p>
            )}
          </div>
        </section>
      )}

      {role === "registrar" && (
        <section className="section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">SYSTEM ADMIN DASHBOARD</div>
              <h2>Routine configuration vs. protected actions</h2>
            </div>
            <span className="count-pill">No unilateral master key</span>
          </div>
          <div className="registrar-grid">
            {state.courses.map((course) => (
              <article className="course-card" key={course.id}>
                <span className="course-code">{course.code}</span>
                <h3>{course.name}</h3>
                <CapacityEditor
                  course={course}
                  actor={demoRegistrar.name}
                  dispatch={dispatch}
                />
                <div className="course-stats">
                  <span>
                    Authorized <b>{course.enrolled.length}</b>
                  </span>
                  <span>
                    Pending <b>{course.waitlist.length}</b>
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="blocked-card">
            <div>
              <span className="blocked-icon">⛔</span>
              <div>
                <strong>Unilateral override attempt demo</strong>
                <p>
                  Try bypassing the queue or adding yourself to the approver panel
                  without a 2-of-3 quorum.
                </p>
              </div>
            </div>
            <button className="button outline" onClick={attemptRegistrarOverrides}>
              Attempt both overrides
            </button>
          </div>
          <RequestForm
            {...{
              state,
              selectedCourse,
              setSelectedCourse,
              requestKind,
              setRequestKind,
              targetStudent,
              setTargetStudent,
              reason,
              setReason,
              panelCandidate,
              setPanelCandidate,
              panelRemoval,
              setPanelRemoval,
              submitRequest,
            }}
            registrar
          />
        </section>
      )}

      {role === "approver" && (
        <section className="section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">APPROVER PANEL</div>
              <h2>Review protected quorum requests</h2>
            </div>
            <span className="count-pill">{state.panel.length} panel members</span>
          </div>
          <div className="panel-strip">
            {state.panel.map((member) => (
              <div className="panel-person" key={member.id}>
                <span className="avatar">
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(-2)
                    .join("")}
                </span>
                <span>
                  <strong>{member.name}</strong>
                  <small>{member.title}</small>
                </span>
              </div>
            ))}
          </div>
          <RequestForm
            {...{
              state,
              selectedCourse,
              setSelectedCourse,
              requestKind,
              setRequestKind,
              targetStudent,
              setTargetStudent,
              reason,
              setReason,
              panelCandidate,
              setPanelCandidate,
              panelRemoval,
              setPanelRemoval,
              submitRequest,
            }}
          />
          <div className="request-list">
            {state.requests.map((request) => (
              <article className="request-card" key={request.id}>
                <div className="request-head">
                  <div>
                    <span className="eyebrow">{actionNames[request.kind]}</span>
                    <h3>
                      {request.kind === "panel"
                        ? `Replace ${request.replaceMember.name} with ${request.candidate.name}`
                        : `${request.kind === "force" ? "Authorize" : request.kind === "jump" ? "Prioritise" : "Revoke"} ${personName(state, request.studentId)} · ${state.courses.find((course) => course.id === request.courseId)?.code}`}
                    </h3>
                  </div>
                  <span className={`status-tag ${request.status}`}>
                    {request.status}
                  </span>
                </div>
                <p className="request-reason">“{request.reason}”</p>
                <div className="vote-row">
                  <span>{request.approvals.length} of 2 approvals</span>
                  <div className="vote-avatars">
                    {request.approvals.map((member) => (
                      <span
                        className="avatar mini"
                        title={member.name}
                        key={member.id}
                      >
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(-2)
                          .join("")}
                      </span>
                    ))}
                  </div>
                </div>
                {request.status === "pending" && (
                  <div className="request-actions">
                    {request.requester === activeApprover?.name ? (
                      <span className="muted">
                        Requester cannot approve their own request
                      </span>
                    ) : (
                      <button
                        className="button approve"
                        onClick={() =>
                          dispatch({
                            type: "vote",
                            requestId: request.id,
                            approver: activeApprover,
                          })
                        }
                        disabled={request.approvals.some(
                          (member) => member.id === activeApprover?.id,
                        )}
                      >
                        Approve as {activeApprover?.name}
                      </button>
                    )}
                    <button
                      className="button text-button"
                      onClick={() =>
                        dispatch({
                          type: "deny",
                          requestId: request.id,
                          actor: activeApprover?.name,
                          reason: "The panel declined this request.",
                        })
                      }
                    >
                      Deny
                    </button>
                  </div>
                )}
              </article>
            ))}
            {state.requests.length === 0 && (
              <p className="empty">
                No open requests. Submit one above to test the 2-of-3 quorum flow.
              </p>
            )}
          </div>
        </section>
      )}

      <section className="section explainer">
        <div className="section-heading">
          <div>
            <div className="eyebrow">WHY TIDECLOAK MATTERS</div>
            <h2>Ordinary roles vs. Emergent Authority</h2>
          </div>
        </div>
        <div className="compare-grid">
          <article className="compare-card ordinary">
            <span>ORDINARY LOGIN + BACKEND ROLES</span>
            <h3>A single admin could</h3>
            <ul>
              <li>Read plaintext records directly from the server database</li>
              <li>Unilaterally grant exceptions without a public audit trail</li>
              <li>Modify the approver panel alone to seize full control</li>
            </ul>
            <p>One trusted backend role is a single point of compromise.</p>
          </article>
          <article className="compare-card tide">
            <span>TIDECLOAK + EMERGENT AUTHORITY</span>
            <h3>This prototype enforces</h3>
            <ul>
              <li>Tag-bound encryption where no single server holds a master key</li>
              <li>Exceptions require a public reason in the transparent audit log</li>
              <li>Two independent panel members must co-sign before authority emerges</li>
            </ul>
            <p>
              Real TideCloak authentication and tag encryption hooks are wired;
              customize src/seed.json for your team’s domain.
            </p>
          </article>
        </div>
      </section>

      <section className="section audit-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">TRANSPARENT BY DEFAULT</div>
            <h2>Public audit log</h2>
          </div>
          <span className="count-pill">{state.audit.length} events</span>
        </div>
        <div className="audit-list">
          {state.audit.map((entry) => (
            <div className="audit-row" key={entry.id}>
              <time>
                {new Date(entry.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
              <span className="audit-dot" />
              <div>
                <strong>{entry.action}</strong>
                <p>{entry.reason}</p>
              </div>
              <span className="audit-actor">{entry.actor}</span>
            </div>
          ))}
          {state.audit.length === 0 && (
            <p className="empty">
              Actions, quorum approvals, denials and blocked override attempts will
              appear here.
            </p>
          )}
        </div>
      </section>

      <footer>
        <span>{seed.appMeta.brandName} · Synthetic data only</span>
        <span>Built with TideCloak · RMIT Hackathon Task 2</span>
      </footer>
    </main>
  );
}

function RequestForm(props) {
  const {
    state,
    selectedCourse,
    setSelectedCourse,
    requestKind,
    setRequestKind,
    targetStudent,
    setTargetStudent,
    reason,
    setReason,
    panelCandidate,
    setPanelCandidate,
    panelRemoval,
    setPanelRemoval,
    submitRequest,
    registrar = false,
  } = props;
  const candidates = [
    ...state.students
      .filter((student) => !state.panel.some((member) => member.id === student.id))
      .slice(0, 5)
      .map((student) => ({ ...student, title: "Community representative" })),
    demoRegistrar,
  ];

  return (
    <form className="request-form" onSubmit={submitRequest}>
      <div className="form-title">
        <div>
          <div className="eyebrow">
            {registrar ? "REQUEST AN EXCEPTION" : "NEW PROTECTED REQUEST"}
          </div>
          <h3>Ask the 2-of-3 panel to review</h3>
        </div>
        <span className="approval-badge">2 of 3 required</span>
      </div>
      <div className="form-grid">
        <label>
          Action
          <select
            value={requestKind}
            onChange={(event) => setRequestKind(event.target.value)}
          >
            {Object.entries(actionNames).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {requestKind !== "panel" && (
          <>
            <label>
              Protected Vault
              <select
                value={selectedCourse}
                onChange={(event) => setSelectedCourse(event.target.value)}
              >
                {state.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} · {course.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Participant
              <select
                value={targetStudent}
                onChange={(event) => setTargetStudent(event.target.value)}
              >
                {state.students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        {requestKind === "panel" && (
          <>
            <label>
              Replace panel member
              <select
                value={panelRemoval}
                onChange={(event) => setPanelRemoval(event.target.value)}
              >
                {state.panel.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              With new member
              <select
                value={panelCandidate}
                onChange={(event) => setPanelCandidate(event.target.value)}
              >
                {candidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        <label className="reason-field">
          Public reason
          <textarea
            required
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={240}
            placeholder="State the reason; this will be recorded in the public audit log."
          />
        </label>
      </div>
      <div className="form-footer">
        <span>Requester cannot approve their own request.</span>
        <button className="button dark" type="submit">
          Submit public request
        </button>
      </div>
    </form>
  );
}

function CapacityEditor({ course, actor, dispatch }) {
  const [capacity, setCapacity] = useState(String(course.capacity));
  useEffect(() => setCapacity(String(course.capacity)), [course.capacity]);

  function save(event) {
    event.preventDefault();
    dispatch({ type: "capacity", courseId: course.id, capacity, actor });
  }

  return (
    <form className="capacity-label" onSubmit={save}>
      <label htmlFor={`capacity-${course.id}`}>Quota limit</label>
      <input
        id={`capacity-${course.id}`}
        type="number"
        min="1"
        value={capacity}
        onChange={(event) => setCapacity(event.target.value)}
      />
      <button className="button quiet" type="submit">
        Save
      </button>
    </form>
  );
}
