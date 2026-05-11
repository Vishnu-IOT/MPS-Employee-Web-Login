import React, { useEffect, useState } from 'react';
import { MdAdd, MdKeyboardArrowLeft } from 'react-icons/md';
import animationData from '../lottie/Allow Permission.json';
import loading from '../lottie/loading.json';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import '../styles/permission.css';
import {
  convertPermissionToLeaveAPI,
  fetchPermisionAPI,
} from '../helper.js/api';
import { FaStopwatch } from 'react-icons/fa6';
import {
  rectIntersection,
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  TouchSensor,
  useSensor,
  useSensors,
  MouseSensor,
} from '@dnd-kit/core';

function DropZone({ visible }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'drop-zone' });

  return (
    <div
      ref={setNodeRef}
      className="mp-drop-zone"
      style={{
        opacity: visible ? 1 : 0,
        background: isOver ? 'rgb(97, 204, 125)' : undefined,
      }}
    >
      ⬇️ Drop here to convert to Leave
    </div>
  );
}

function Card({ item }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
    });

  return (
    <div
      ref={setNodeRef}
      className="perm-card"
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 999 : 'auto',
        position: 'relative',
      }}
    >
      <div className="perm-top">
        <div style={{ display: 'flex', gap: '10px' }}>
          <div
            className="perm-clock"
            {...listeners}
            {...attributes}
            style={{
              touchAction: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              minWidth: 36,
              minHeight: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaStopwatch />
          </div>
          <div>
            <h4>Permission</h4>
            <span className="date">{item.attendance_date}</span>
          </div>
        </div>
        <span className={`status ${item.status.toLowerCase()}`}>
          {item.status}
        </span>
      </div>

      <div className="perm-time">
        <div>
          <span>Start Time</span>
          <strong>{item.start_time}</strong>
        </div>
        <div>
          <span>End Time</span>
          <strong>{item.end_time}</strong>
        </div>
        <div>
          <span>Hours</span>
          <strong>{item.permission_hours}</strong>
        </div>
      </div>

      <div className="reason">Reason : {item.reason}</div>
    </div>
  );
}

function Permission() {
  const navigate = useNavigate();
  const [permissionData, setPermissionData] = useState([]);
  const [active, setActive] = useState('Total');
  const [loadingState, setLoadingState] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    async function permission() {
      setLoadingState(true); // start loading
      try {
        const data = await fetchPermisionAPI();
        setPermissionData(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false); // stop loading
      }
    }
    permission();
  }, []);

  // useEffect(() => {
  //   const mockData = [
  //     {
  //       id: '1',
  //       attendance_date: '2026-05-01',
  //       start_time: '09:00:00',
  //       end_time: '11:00:00',
  //       permission_hours: '2',
  //       reason: 'Doctor Appointment',
  //       status: 'Approved',
  //     },
  //     {
  //       id: '2',
  //       attendance_date: '2026-05-02',
  //       start_time: '10:00:00',
  //       end_time: '12:30:00',
  //       permission_hours: '2.5',
  //       reason: 'Bank Work',
  //       status: 'Pending',
  //     }
  //   ];
  //   setPermissionData(mockData);
  // }, []);

  const handleConvertLeave = async () => {
    try {
      await convertPermissionToLeaveAPI(selectedId);
      setShowConfirm(false);
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    }
  };

  const formatTo12Hour = (timeStr) => {
    if (!timeStr || timeStr === '-:--:--') return '-:--:--';
    const date = new Date(`1970-01-01T${timeStr}`);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const filteredData =
    active === 'Total'
      ? permissionData
      : permissionData.filter(
          (item) => item.status?.toLowerCase() === active.toLowerCase()
        );

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={(event) => {
          setActiveId(event.active.id);
        }}
        onDragEnd={(event) => {
          setActiveId(null);
          const { active, over } = event;
          if (over?.id === 'drop-zone') {
            setSelectedId(active.id);
            setShowConfirm(true);
          }
        }}
      >
        <div className="permission-screen">
          <div className="report-top">
            <div className="report-back">
              <button className="down-btn" onClick={() => navigate('/home')}>
                <MdKeyboardArrowLeft />
              </button>
              <h3 style={{ fontWeight: 600, fontSize: '16px' }}>MPeoples</h3>
            </div>

            <div className="permission-main">
              <div className="page-headers glass-panels">
                <div className="header-content">
                  <div className="permission-title-groups">
                    <Lottie
                      animationData={animationData}
                      style={{ width: 100, height: 100 }}
                    />
                    <div>
                      <h2>Permission History</h2>
                      <p>
                        Manage employee permission requests efficiently and
                        monitor their approval status in one centralized place.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="permission-history">
                <h4>Permission History</h4>
              </div>

              <div className="apply-des-main desktop-only">
                <div
                  className="apply-btn"
                  onClick={() => navigate('/apply-permission')}
                >
                  <span style={{ fontSize: '18px' }}>
                    <MdAdd />
                  </span>
                  <span>Apply Permission</span>
                </div>
              </div>

              <div className="page-tabs">
                {['Total', 'Approved', 'Rejected', 'Pending'].map((tab) => (
                  <button
                    key={tab}
                    className={`page-tab ${active === tab ? 'active' : ''}`}
                    onClick={() => setActive(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {loadingState ? (
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
              ) : filteredData && filteredData.length > 0 ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      flexDirection: 'column',
                    }}
                  >
                    <div className="perm-list">
                      {filteredData.map((item) => (
                        <Card key={item.id} item={item} />
                      ))}
                    </div>
                  </div>

                  <div className="desktop-attendance-table">
                    <div className="desktop-table-headers">
                      <span>Date</span>
                      <span>Start Time</span>
                      <span>End Time</span>
                      <span>Permission Hours</span>
                      <span>Reason</span>
                      <span>Status</span>
                    </div>
                    {filteredData.map((log, i) => (
                      <div className="desktop-table-rows" key={i}>
                        <span>{log.attendance_date}</span>
                        <span>{formatTo12Hour(log.start_time)}</span>
                        <span>{formatTo12Hour(log.end_time)}</span>
                        <span>{log.permission_hours}</span>
                        <span>{log.reason}</span>
                        <span>
                          <div
                            className={`badge ${
                              log.status === 'pending'
                                ? 'late'
                                : log.status === 'approved'
                                  ? 'PRESENT'
                                  : 'ABSENT'
                            }`}
                          >
                            {log.status}
                          </div>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="permission-title-group">
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    style={{ width: 120, height: 120, transform: 'none' }}
                  />
                  <div>
                    <p>No Permission Found</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {activeId ? (
          <DropZone visible={!!activeId} />
        ) : (
          <div className="apply-mob-main mobile-only">
            <div
              className="apply-btn"
              onClick={() => navigate('/apply-permission')}
            >
              <span style={{ fontSize: '18px' }}>
                <MdAdd />
              </span>
              <span>Apply Permission</span>
            </div>
          </div>
        )}

        <DragOverlay dropAnimation={null}>{activeId ? null : null}</DragOverlay>
      </DndContext>

      {showConfirm && (
        <div className="dialog-overlay" onClick={() => setShowConfirm(false)}>
          <div className="mp-bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <h2 className="dialog-title">Convert to Leave</h2>
            <div className="dialog-content">
              <div className="dialog-row">
                <span className="icon">🕒</span>
                <span>
                  Are you sure you want to convert this Permission to Leave?
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="submit-btn"
                style={{ background: 'var(--blue-primary)' }}
                onClick={handleConvertLeave}
              >
                Convert
              </button>
              <button
                className="submit-btn"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Permission;
