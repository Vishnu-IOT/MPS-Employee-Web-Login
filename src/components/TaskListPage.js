import React, { useEffect, useState } from 'react';
import CreateTask from './CreateTask';
import '../styles/CreateTask.css';
import { fetchTaskListAPI, UpdateStartandEndTaskAPI } from '../helper.js/api';
import Lottie from 'lottie-react';
import loading from '../lottie/loading.json';

/* ── Icons ── */
// const BookmarkIcon = () => (
//   <svg width="12" height="16" viewBox="0 0 12 16" fill="#36B37E">
//     <path d="M0 0h12v16l-6-4-6 4V0z" />
//   </svg>
// );

const ChevronDownIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const RefreshIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 6H6a4 4 0 000 8h4M13 6l-3-3M13 6l-3 3" />
  </svg>
);

const ColumnsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="2" width="4" height="12" rx="1" />
    <rect x="6" y="2" width="4" height="12" rx="1" />
    <rect x="11" y="2" width="4" height="12" rx="1" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M8 2v12M2 8h12" />
  </svg>
);

const DotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="4" cy="8" r="1.5" />
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="12" cy="8" r="1.5" />
  </svg>
);

/* ── Priority breakdown icons ── */
const HighestIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#c9372c"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 11l6-6 6 6" />
    <path d="M2 6l6-6 6 6" />
  </svg>
);

const HighIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#e2341d"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 10l6-6 6 6" />
  </svg>
);

const MediumIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#ff8b00"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M2 6h12M2 10h12" />
  </svg>
);

const LowIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#626f86"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 6l6 6 6-6" />
  </svg>
);

const LowestIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#626f86"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 4l6 6 6-6" />
    <path d="M2 9l6 6 6-6" />
  </svg>
);

const Avatar = ({ name, src }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="task-avatar" title={name}>
      {src ? <img src={src} alt={name} /> : initials}
    </div>
  );
};

const PriorityMedium = ({ priority }) => {
  // const priorityColor = {
  //   very_high: '#dc0000',
  //   high: '#ba2e0f',
  //   medium: '#fd8c00',
  //   low: '#67a353',
  //   very_low: '#4caf50',
  // };
  const priorityIcon = {
    very_high: <HighestIcon />,
    high: <HighIcon />,
    medium: <MediumIcon />,
    low: <LowIcon />,
    very_low: <LowestIcon />,
  };

  return (
    <div className="task-priority-icon">
      <span
      // style={{
      //   width: '100%',
      //   background: priorityColor[priority] || '#67a353',
      // }}
      >
        {priorityIcon[priority]}
      </span>
      {/* <span
        style={{
          width: '75%',
          background: priorityColor[priority] || '#67a353',
        }}
      /> */}
    </div>
  );
};

const statusList = [
  { label: 'TO DO', value: 'todo' },
  { label: 'IN PROGRESS', value: 'in-progress' },
  { label: 'ON HOLD', value: 'hold' },
  { label: 'NOT COMPLETED', value: 'not_completed' },
  { label: 'PENDING', value: 'pending' },
  { label: 'COMPLETED', value: 'completed' },
];

const statusLists = [
  // { label: 'TO DO', value: 'todo' },
  // { label: 'IN PROGRESS', value: 'in-progress' },
  { label: 'ON HOLD', value: 'hold' },
  { label: 'NOT COMPLETED', value: 'not_completed' },
  // { label: 'PENDING', value: 'pending' },
  { label: 'COMPLETED', value: 'completed' },
];

const StatusBadge = ({ status, onChange }) => {
  const selectedStatus = statusList.find(
    (item) => item.value === status
  );

  return (
    <span
      // value={status}
      onChange={(e) => onChange(e.target.value)}
      className={`task-status-badge task-status-badge--${status}`}
    >
      {/* {statusList.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))} */}
      {selectedStatus.label}
    </span>
  );
};

function TaskListPage() {
  const [loadingState, setLoadingState] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [updateTask, setUpdateTask] = useState({
    id: '',
    type: '',
    status: '',
    reason: '',
  });

  const [openTask, setOpenTask] = useState(false);

  useEffect(() => {
    const task = async () => {
      setLoadingState(true);
      try {
        const data = await fetchTaskListAPI();
        if (data.success) {
          setTasks(data.tasks);
          setMembers(data.team_members);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingState(false);
      }
    };
    task();
  }, [showCreate]);

  const formatTo12Hour = (timeStr) => {
    if (
      !timeStr ||
      timeStr === '-:--:--' ||
      timeStr === '--:--:--' ||
      timeStr === '--:--'
    )
      return '--:--:--';

    const date = new Date(`1970-01-01T${timeStr}`);

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      //   second: '2-digit', // ✅ include seconds
      hour12: true,
    });
  };

  const initials = (name) => {
    return name
      .trim()
      .split(' ')
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleUpdateTask = async (id, type) => {
    const formData = new FormData();

    Object.keys(updateTask).forEach((key) => {
      if (
        updateTask[key] !== '' &&
        updateTask[key] !== null &&
        updateTask[key] !== undefined
      ) {
        formData.append(key, updateTask[key]);
      }
    });
    // formData.append('id', id);
    // formData.append('type', type);

    try {
      const data = await UpdateStartandEndTaskAPI(formData);
      if (data.success) {
        alert(`Task ${updateTask.type}ed`);
      }
      setUpdateTask({
        id: '',
        type: '',
        status: '',
        reason: '',
      });
    } catch (error) {
      console.error(error);
      // alert('Error submitting form');
    } finally {
      setOpenTask(false);
    }
  };

  return (
    <>
      {/* Toolbar — only shown on List tab */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            border: '1px solid #dfe1e6',
            borderRadius: 3,
            background: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            color: '#626f86',
            fontFamily: "'DM Sans',sans-serif",
            flex: 1,
            maxWidth: 200,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="#626f86"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3 3" />
          </svg>
          Search work
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {members.slice(0, 5).map((av, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#0052cc,#4bade8)',
                border: '2px solid #fff',
                marginLeft: i > 0 ? -8 : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {initials(av.name)}
            </div>
          ))}

          {members.length > 5 && (
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#dfe1e6',
                border: '2px solid #fff',
                marginLeft: -8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                color: '#172b4d',
              }}
            >
              +{members.length - 5}
            </div>
          )}
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 12px',
            border: '1px solid #dfe1e6',
            borderRadius: 3,
            background: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            color: '#172b4d',
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="#626f86"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M2 4h12M4 8h8M7 12h2" />
          </svg>
          Filter
        </button>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 12px',
            border: '1px solid #dfe1e6',
            borderRadius: 3,
            background: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            color: '#172b4d',
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="#626f86"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" />
          </svg>
          Group
        </button>
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 12px',
              border: '1px solid #dfe1e6',
              borderRadius: 3,
              background: 'var(--blue-primary)',
              cursor: 'pointer',
              fontSize: 13,
              color: '#ffffff',
              fontFamily: "'DM Sans',sans-serif",
            }}
            onClick={() => setShowCreate(true)}
          >
            <PlusIcon /> Create Task
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              border: '1px solid #dfe1e6',
              borderRadius: 3,
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              color: '#172b4d',
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Saved filters <ChevronDownIcon />
          </button>
          <div
            style={{
              display: 'flex',
              border: '1px solid #dfe1e6',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <button
              style={{
                padding: '6px 10px',
                border: 'none',
                background: '#e9f2ff',
                cursor: 'pointer',
                color: '#0052cc',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ColumnsIcon />
            </button>
            <button
              style={{
                padding: '6px 10px',
                border: 'none',
                borderLeft: '1px solid #dfe1e6',
                background: '#fff',
                cursor: 'pointer',
                color: '#626f86',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <DotsIcon />
            </button>
          </div>
          <button
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#626f86',
              padding: 6,
              borderRadius: 3,
            }}
          >
            <DotsIcon />
          </button>
        </div>
      </div>

      {/* Task Table */}
      <div className="task-list-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th className="col-check">
                <input type="checkbox" style={{ accentColor: '#0052cc' }} />
              </th>
              <th className="col-status">Task Date</th>
              <th className="col-work">Project</th>
              <th className="col-assignee">Title</th>
              <th className="col-assignee">Description</th>
              <th className="col-assignee">Assigned By</th>
              <th className="col-reporter">Assigned To</th>
              <th className="col-priority">Priority</th>
              <th className="col-status">Status</th>
              <th className="col-reporter">Start Time</th>
              <th className="col-reporter">End Time</th>
              <th className="col-resolution">Work Duration</th>
              <th className="col-actions"></th>
            </tr>
          </thead>

          {loadingState ? (
            <tbody>
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: 'center',

                    // padding: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Lottie
                      animationData={loading}
                      style={{ width: 100, height: 100 }}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : tasks && tasks.length > 0 ? (
            <tbody>
              {tasks?.map((task,i) => (
                <tr key={task.id}>
                  <td className="col-check">
                    <input type="checkbox" style={{ accentColor: '#0052cc' }} />
                    {i+1}
                  </td>

                  <td>{task.task_date}</td>

                  <td>
                    <div className="task-cell-work">
                      {/* <span className="task-story-bookmark">
                      <BookmarkIcon />
                    </span>
                    <a href="#" className="task-id-link">
                      {task.id}
                    </a> */}
                      <span className="task-summary">{task.project_name}</span>
                    </div>
                  </td>

                  <td>
                    <div className="task-cell-user">
                      <span className="task-user-name">{task.title}</span>
                    </div>
                  </td>

                  <td>
                    <div className="task-cell-user">
                      <span className="task-user-name">{task.description}</span>
                    </div>
                  </td>

                  <td>
                    <div className="task-cell-user">
                      <Avatar name={task.assigned_by_name} />
                      <span className="task-user-name">
                        {task.assigned_by_name}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="task-cell-user">
                      <Avatar name={task.assigned_to_name} />
                      <span className="task-user-name">
                        {task.assigned_to_name}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="task-priority">
                      <PriorityMedium priority={task.priority} />
                      {task.priority}
                    </div>
                  </td>

                  <td>
                    <StatusBadge
                      status={task.status}
                      onChange={(value) => {
                        setTasks((prev) =>
                          prev.map((t) =>
                            t.id === task.id ? { ...t, status: value } : t
                          )
                        );
                      }}
                    />
                  </td>

                  <td style={{ color: '#626f86', fontSize: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 8,
                        alignItems: 'center',
                      }}
                    >
                      {formatTo12Hour(task.start_time)}

                      {!task.start_time && (
                        <button
                          type="button"
                          className="tl-start-btn"
                          onClick={() => {
                            setUpdateTask((prev) => ({
                              ...prev,
                              id: task.id,
                              type: 'start',
                            }));
                            setOpenTask(true);
                          }}
                        >
                          Start
                        </button>
                      )}
                    </div>
                  </td>

                  <td style={{ color: '#626f86', fontSize: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 8,
                        alignItems: 'center',
                      }}
                    >
                      {formatTo12Hour(task.end_time)}

                      {!task.end_time && (
                        <button
                          type="button"
                          className="tl-end-btn"
                          onClick={() => {
                            setUpdateTask((prev) => ({
                              ...prev,
                              id: task.id,
                              type: 'end',
                            }));
                            setOpenTask(true);
                          }}
                        >
                          End
                        </button>
                      )}
                    </div>
                  </td>

                  <td
                    style={{
                      color: '#626f86',
                      fontSize: 14,
                      textAlign: 'center',
                    }}
                  >
                    {task.duration ? `${task.duration} Hrs` : '--:--'}
                  </td>

                  <td>
                    <button
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#626f86',
                        padding: 4,
                        borderRadius: 3,
                        display: 'flex',
                      }}
                    >
                      <DotsIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                No Tasks Found
              </td>
            </tr>
          )}
        </table>
        <div className="task-table-footer" onClick={() => setShowCreate(true)}>
          <PlusIcon />
          <span>Create</span>
          <div className="task-table-footer-right">
            <span>1 of 1</span>
            <RefreshIcon />
          </div>
        </div>
      </div>
      {/* Start and End Task Dialog Box */}
      {openTask && (
        <div
          className="ddl-dialog-overlay"
          style={{ color: 'black', zIndex: '9999' }}
          onClick={() => setOpenTask(false)}
        >
          <div className="ddl-dialog-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="ddl-dialog-title">{updateTask.type} Task</h2>
            <div className="ddl-dialog-content">
              <div className="ddl-dialog-row">
                {/* <span className="ddl-icon">🕒</span> */}
                <span>Are you sure want to {updateTask.type} Task?</span>
                {updateTask.type === 'end' && (
                  <>
                    <select
                      value={updateTask.status}
                      onChange={(e) => {
                        setUpdateTask((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }));
                      }}
                      className="ddl-select"
                    >
                      {statusLists.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <textarea
                      className="ddl-textarea"
                      placeholder="Give the Task Feedback"
                      onChange={(e) => {
                        setUpdateTask((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }));
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            <div
              style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}
            >
              <button
                className="ddl-submit-btn"
                style={{
                  background:
                    updateTask.type === 'start'
                      ? 'linear-gradient(135deg, #36b37e, #2ea66f)'
                      : 'linear-gradient(135deg, #bf2600, #a61f00)',
                }}
                onClick={handleUpdateTask}
              >
                {updateTask.type}
              </button>
              <button
                className="ddl-submit-btn"
                style={{ background: 'var(--blue-light)' }}
                onClick={() => setOpenTask(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Create Task panel */}
      {showCreate && <CreateTask onClose={() => setShowCreate(false)} />}
    </>
  );
}

export default TaskListPage;
