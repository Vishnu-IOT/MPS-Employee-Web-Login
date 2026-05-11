import { useState, useRef, useEffect } from 'react';
import {
  fetchProjectListAPI,
  fetchTeamMembersListAPI,
  storeCreateTaskAPI,
} from '../helper.js/api';

/* ─── Icons ─── */
const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const MinusIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M3 8h10" />
  </svg>
);
const ExpandIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 11L2 14m0 0h4m-4 0v-4M11 5l3-3m0 0h-4m4 0v4" />
  </svg>
);
const CollapseIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 2l4 4m0 0V2m0 4H2M14 14l-4-4m0 0v4m0-4h4" />
  </svg>
);
const CloseIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M12 4L4 12M4 4l8 8" />
  </svg>
);

const priority = [
  { id: 'very_high', label: 'VERY HIGH', color: '#dc0000' },
  { id: 'high', label: 'HIGH', color: '#ba2e0f' },
  { id: 'medium', label: 'MEDIUM', color: '#fd8c00' },
  { id: 'low', label: 'LOW', color: '#67a353' },
  { id: 'very_low', label: 'VERY LOW', color: '#67a353' },
];

/* ─── WorkTypeIcon ─── */
const WorkTypeIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <rect width="16" height="16" rx="2" fill={color} />
    <path
      d="M3 4h10M3 8h7M3 12h5"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function CreateTask({ onClose }) {
  const [projectData, setProjectData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [taskData, setTaskData] = useState({
    project_id: '',
    user_id: '',
    title: '',
    description: '',
    reason: '',
    priority: '',
  });

  const [summary, setSummary] = useState('');
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('');
  const [memberType, setMemberType] = useState('');
  const [status, setStatus] = useState('');

  const [summaryTouched, setSummaryTouched] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);

  const [createAnother, setCreateAnother] = useState(false);
  const [editorFocused, setEditorFocused] = useState(false);
  const [editorContent, setEditorContent] = useState('');

  const [showMemberDrop, setShowMemberDrop] = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [showProjectDrop, setShowProjectDrop] = useState(false);

  const [maximized, setMaximized] = useState(false);
  const editorRef = useRef(null);

  const summaryError = summaryTouched && !summary.trim();
  const titleError = titleTouched && !title.trim();
  const selectedMember = memberData?.filter((w) => w.designation !== 'TL');
  const selectedTL = memberData?.find((w) => w.designation === 'TL');
  useEffect(() => {
    const close = () => {
      setShowMemberDrop(false);
      setShowStatusDrop(false);
      setShowProjectDrop(false);
    };
    const project = async () => {
      try {
        const data = await fetchProjectListAPI();
        const data2 = await fetchTeamMembersListAPI();

        console.log(data);
        if (data.success) {
          setProjectData(data?.data || []);
        }
        if (data2.success) {
          setMemberData(data2?.data || []);
        }
      } catch (err) {
        console.log(err);
        setProjectData([]);
        setMemberData([]);
      }
    };
    project();
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleCreate = async () => {
    const formData = new FormData();

    Object.keys(taskData).forEach((key) => {
      if (
        taskData[key] !== '' &&
        taskData[key] !== null &&
        taskData[key] !== undefined
      ) {
        formData.append(key, taskData[key]);
      }
    });

    try {
      const data = await storeCreateTaskAPI(formData);
      setTaskData({
        project_id: '',
        user_id: '',
        title: '',
        description: '',
        reason: '',
        priority: '',
      });
      setSummaryTouched(true);
      if (!summary.trim()) return;
      if (data.success) {
        alert(`Task created: "${title}"`);
        if (!createAnother && onClose) onClose();
        else {
          setSummary('');
          setSummaryTouched(false);
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    }
  };

  const dialogClass = maximized
    ? 'ns-dialog ns-dialog--center'
    : 'ns-dialog ns-dialog--left';

  return (
    <>
      {/* Overlay only when maximized (center mode) */}
      {maximized && (
        <div
          className="ns-overlay-backdrop"
          onClick={() => setMaximized(false)}
        />
      )}

      <div className={dialogClass} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ns-header">
          <div className="ns-header-left">
            <div className="ns-bookmark">
              <svg viewBox="0 0 12 16" fill="#36B37E">
                <path d="M0 0h12v16l-6-4-6 4V0z" />
              </svg>
            </div>
            <span className="ns-title">Create Task</span>
          </div>
          <div className="ns-header-actions">
            <button className="ns-icon-btn" title="Minimize" onClick={onClose}>
              <MinusIcon />
            </button>
            <button
              className="ns-icon-btn"
              title={maximized ? 'Restore' : 'Expand'}
              onClick={() => setMaximized((p) => !p)}
            >
              {maximized ? <CollapseIcon /> : <ExpandIcon />}
            </button>
            <button className="ns-icon-btn" title="Close" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="ns-body">
          <div className="ns-required-note">
            Required fields are marked with an asterisk{' '}
            <span className="ns-asterisk">*</span>
          </div>

          {/* Project */}
          <div className="ns-field">
            <label className="ns-label">
              Project <span className="ns-asterisk">*</span>
            </label>
            <div
              style={{ position: 'relative' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowProjectDrop((p) => !p);
                setShowStatusDrop(false);
                setShowMemberDrop(false);
              }}
            >
              <div className="ns-space-select">
                <span className="ns-work-text">{project}</span>
                <span className="ns-chevron">
                  <ChevronIcon />
                </span>
              </div>
              {showProjectDrop && (
                <div className="ns-dropdown">
                  {projectData?.map((w) => (
                    <div
                      key={w.id}
                      className={`ns-dropdown-item ${taskData.project_id === w.id ? 'ns-selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setProject(w.project_name);
                        setTaskData((prev) => ({
                          ...prev,
                          project_id: w.id,
                        }));
                        setShowProjectDrop(false);
                      }}
                    >
                      {w.project_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Work type + Status */}
          <div className="ns-row">
            <div className="ns-field">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <label className="ns-label">
                  Team Members <span className="ns-asterisk">*</span>
                </label>
                <span
                  style={{
                    fontSize: '13px',
                    color: '#0c66e4',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    setMemberType(selectedTL?.name);

                    setTaskData((prev) => ({
                      ...prev,
                      user_id: selectedTL?.id,
                    }));
                  }}
                >
                  Assign to Me
                </span>
              </div>
              <div
                style={{ position: 'relative' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMemberDrop((p) => !p);
                  setShowStatusDrop(false);
                  setShowProjectDrop(false);
                }}
              >
                <div className="ns-work-select">
                  <span className="ns-work-text">{memberType}</span>
                  <span className="ns-chevron">
                    <ChevronIcon />
                  </span>
                </div>
                {showMemberDrop && (
                  <div className="ns-dropdown">
                    {selectedMember?.map((w) => (
                      <div
                        key={w.id}
                        className={`ns-dropdown-item ${taskData.user_id === w.id ? 'ns-selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMemberType(w.name);
                          setTaskData((prev) => ({
                            ...prev,
                            user_id: w.id,
                          }));
                          setShowMemberDrop(false);
                        }}
                      >
                        {w.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="ns-field">
              <label className="ns-label">Priority</label>
              <div
                style={{ position: 'relative' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStatusDrop((p) => !p);
                  setShowMemberDrop(false);
                  setShowProjectDrop(false);
                }}
              >
                <div className="ns-space-select">
                  <span className="ns-space-text">{status}</span>
                  <span className="ns-chevron">
                    <ChevronIcon />
                  </span>
                </div>
                {showStatusDrop && (
                  <div className="ns-dropdown">
                    {priority.map((s) => (
                      <div
                        key={s.id}
                        className={`ns-dropdown-item ${status === s.label ? 'ns-selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatus(s.label);
                          setTaskData((prev) => ({
                            ...prev,
                            priority: s.id,
                          }));
                          setShowStatusDrop(false);
                        }}
                      >
                        <WorkTypeIcon color={s.color} />
                        {s.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="ns-field">
            <label className="ns-label">
              Title <span className="ns-asterisk">*</span>
            </label>
            <input
              type="text"
              className={`ns-input ${titleError ? 'ns-input--error' : ''}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTaskData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
              onBlur={() => setTitleTouched(true)}
            />
            {titleError && (
              <div className="ns-error-msg">
                <div className="ns-error-icon">!</div>
                Title is required
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="ns-field">
            <label className="ns-label">
              Summary <span className="ns-asterisk">*</span>
            </label>
            <input
              type="text"
              className={`ns-input ${summaryError ? 'ns-input--error' : ''}`}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setTaskData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
              onBlur={() => setSummaryTouched(true)}
            />
            {summaryError && (
              <div className="ns-error-msg">
                <div className="ns-error-icon">!</div>
                Summary is required
              </div>
            )}
          </div>

          {/* Reason */}
          <div className="ns-field">
            <label className="ns-label">Reason</label>
            <div className="ns-editor">
              <div
                ref={editorRef}
                className={`ns-editor-area ${editorContent ? 'ns-typed' : ''}`}
                contentEditable
                suppressContentEditableWarning
                onFocus={() => setEditorFocused(true)}
                onBlur={(e) => {
                  const value = e.currentTarget.innerText;
                  setEditorFocused(false);
                  setEditorContent(value);
                  setTaskData((prev) => ({
                    ...prev,
                    reason: value,
                  }));
                }}
                onInput={(e) => {
                  const value = e.currentTarget.innerText;
                  setEditorContent(value);
                  setTaskData((prev) => ({
                    ...prev,
                    reason: value,
                  }));
                }}
                data-placeholder="Detailed Task Description"
              />
              {!editorContent && !editorFocused && (
                <div
                  style={{
                    position: 'absolute',
                    pointerEvents: 'none',
                    fontSize: 14,
                    color: '#626f86',
                    padding: '8px 10px',
                    fontFamily: 'DM Sans, sans-serif',
                    marginTop: -46,
                  }}
                >
                  Detailed Task Description
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ns-footer">
          <label className="ns-checkbox-label">
            <input
              type="checkbox"
              className="ns-checkbox"
              checked={createAnother}
              onChange={(e) => setCreateAnother(e.target.checked)}
            />
            Create another
          </label>
          <div className="ns-footer-btns">
            <button className="ns-btn ns-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="ns-btn ns-btn-create" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
