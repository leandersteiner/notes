# Snippets

## Base API Layer

```ts
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const axiosConfig: AxiosRequestConfig = {
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
    Accepts: 'application/json'
  }
};

const axiosInstance = axios.create(axiosConfig);

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = sessionStorage.getItem('token');
  if (token) {
    const newConfig = { ...config };
    newConfig.headers.Authorization = `Bearer ${token.replaceAll('"', '')}`;
    return newConfig;
  }
  return config;
};

axiosInstance.interceptors.request.use(onRequest);

const buildApi = (instance: AxiosInstance) => {
  return {
    get: <T>(url: string, config: AxiosRequestConfig = {}) => instance.get<T>(url, config),
    delete: <T>(url: string, config: AxiosRequestConfig = {}) => instance.delete<T>(url, config),
    post: <T>(url: string, body: unknown, config: AxiosRequestConfig = {}) =>
      instance.post<T>(url, body, config),
    patch: <T>(url: string, body: unknown, config: AxiosRequestConfig = {}) =>
      instance.patch<T>(url, body, config),
    put: <T>(url: string, body: unknown, config: AxiosRequestConfig = {}) =>
      instance.put<T>(url, body, config)
  };
};

export const api = buildApi(axiosInstance);
```

## API Implementation

```ts
import { User } from '../models/user/User';
import { api } from './api';

export type UserResponse = User;

type UpdateUserRequest = Partial<User>;

const getUser = (userId: string) => api.get<UserResponse>(`users/${userId}`).then(res => res.data);

const getAllUsers = () => api.get<User[]>('users').then(res => res.data);

const updateUser = (userId: string) => (data: UpdateUserRequest) =>
  api.patch<UserResponse>(`users/${userId}`, data).then(res => res.data);

const deleteUser = (userId: string) => api.delete(`users/${userId}`);

export const UserApi = {
  get: getUser,
  all: getAllUsers,
  update: updateUser,
  delete: deleteUser
};
```

## UseStorage Hook

```ts
import {
  Dispatch,
  DispatchWithoutAction,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';

const getSavedValue = <T>(key: string, initialValue: T, storage: Storage): T => {
  const jsonValue = storage.getItem(key);
  if (jsonValue != null) return JSON.parse(jsonValue) as T;

  if (initialValue instanceof Function) return initialValue() as T;
  return initialValue;
};

const useStorage = <T>(
  key: string,
  initialValue: T,
  storage: Storage
): [T | null, Dispatch<SetStateAction<T | null>>, DispatchWithoutAction] => {
  const [value, setValue] = useState<T | null>(getSavedValue(key, initialValue, storage));

  useEffect(() => {
    if (value === null) return storage.removeItem(key);
    storage.setItem(key, JSON.stringify(value));
  }, [key, value, storage]);

  const removeValue = useCallback(() => setValue(null), []);

  return [value, setValue, removeValue];
};

/**
 * Example:
 * const [token, setToken, removeToken] = useSessionStorage("token", "")
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  return useStorage(key, initialValue, window.localStorage);
};

export const useSessionStorage = <T>(key: string, initialValue: T) => {
  return useStorage(key, initialValue, window.sessionStorage);
};
```

## Context

```ts
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { User } from '../models/user/User';
import { useSessionStorage } from '../hooks/useStorage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  onLogin: (user: User, token: string) => void;
  onLogout: () => void;
}

const defaultContext: AuthContextType = {
  user: null,
  token: null,
  onLogin: () => {},
  onLogout: () => {}
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = (props: AuthProviderProps) => {
  const [user, setUser, removeUser] = useSessionStorage<User | null>('user', null);
  const [token, setToken, removeToken] = useSessionStorage<string | null>('token', null);

  const values = useMemo(
    () => ({
      user,
      token,
      onLogin: (newUser: User, newToken: string) => {
        setUser(newUser);
        setToken(newToken);
      },
      onLogout: () => {
        removeToken();
        removeUser();
      }
    }),
    [user, token, setUser, setToken, removeToken, removeUser]
  );

  return <AuthContext.Provider value={values}>{props.children}</AuthContext.Provider>;
};
```

## Forms with antd

```ts
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, notification } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { usePathContext } from '../../context/PathContext';

type LoginFormData = {
  username: string;
  password: string;
};

export const LoginForm = () => {
  const { onLogin, token } = useAuth();
  const navigate = useNavigate();
  const { mutate: login } = useMutation(AuthApi.login);
  const { setPath } = usePathContext();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => setPath('login'), [setPath]);

  if (token) return <Navigate to='/home' replace />;

  const onFinish = async (data: LoginFormData) => {
    login(data, {
      onSuccess: response => {
        onLogin(response.user, response.token);
        Promise.resolve().then(() => {
          api.success({
            message: 'Login successful'
          });
        });
        navigate('/home');
      },
      onError: () => {
        api.error({
          message: 'Login failed',
          description: 'Please check your username and password'
        });
      }
    });
  };

  return (
    <>
      {contextHolder}
      <Form
        name='normal_login'
        className='login-form'
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name='username'
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Username' />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='Password'
          />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' className='login-form-button'>
            Log in
          </Button>
          Or <Link to='/auth/register'>register now!</Link>
        </Form.Item>
      </Form>
    </>
  );
};
```

## Protected Route

```ts
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type ProtectedRouteProps = {
  children: JSX.Element;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to='/auth/login' replace />;
  }

  return children;
};
```

## Example Component Hierarchy

```ts
import { Space } from 'antd';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { BoardColumn } from './BoardColumn';
import { DroppableTypes } from '../../constants/DroppableTypes';
import { StrictModeDroppable } from '../dnd/StrictModeDroppable';
import { AddNewItem } from './AddNewItem';
import { TaskApi, TaskStateApi } from '../../api/taskApi';
import { Task } from '../../models/task/Task';
import { Board as BoardModel } from '../../models/board/Board';
import { moveInList, moveTaskBetweenColumns, reorder } from '../../helpers/drag';
import { BoardColumnApi } from '../../api/boardApi';
import { NotFound } from '../../views/NotFound';
import { BACKLOG_ID } from '../../constants/board';
import { useBoard } from '../../context/BoardContext';
import { BacklogColumn } from './BacklogColumn';
import { BoardColumn as BoardColumnModel } from '../../models/board/BoardColumn';

const parseDndId = (dndId: string) => dndId.split(':')[1];

type BoardProps = {
  board: BoardModel;
  backlog: Task[];
};

export const Board = ({ board: model, backlog: b }: BoardProps) => {
  const [board, setBoard] = useState<BoardModel>(model);
  const [backlog, setBacklog] = useState<Task[]>(b);
  const [dragging, setDragging] = useState(false);
  const { projectId } = useBoard();

  const { mutate: updateTask } = useMutation(TaskApi.update(projectId));
  const { mutate: updateColumn } = useMutation(BoardColumnApi.update(projectId));
  const { mutate: createColumn } = useMutation(BoardColumnApi.create(projectId));
  const { mutate: createTaskState } = useMutation(TaskStateApi.create(projectId));
  const { mutate: deleteColumn } = useMutation(BoardColumnApi.delete(projectId));

  if (!model) return <NotFound />;

  const handleColumnUpdated = (column: BoardColumnModel) => {
    setBoard({
      ...board,
      columns: reorder([...board.columns.filter(col => col.id !== column.id), column])
    });
  };

  const handleCardMoved = (taskId: string, columnId: string, index: number) => {
    const toBacklog = columnId === BACKLOG_ID;
    const fromBacklog = !!backlog.find(task => task.id === taskId);

    if (fromBacklog) {
      const movedTask = backlog.find(t => t.id === taskId);
      if (!movedTask) return;

      if (toBacklog) {
        moveInList(backlog, movedTask.position, index);
        setBacklog([...backlog]);
        backlog.forEach(task => updateTask(task));
      } else {
        movedTask.boardColumnId = columnId;
        const newColumn = board.columns.find(column => column.id === columnId);
        if (!newColumn) return;
        const { newSource, newDestination } = moveTaskBetweenColumns(
          backlog,
          BACKLOG_ID,
          newColumn.tasks,
          newColumn.id,
          movedTask,
          index
        );
        newColumn.tasks = newDestination;
        setBacklog([...newSource]);
        setBoard({ ...board });
        backlog.forEach(task => updateTask(task));
        newColumn.tasks.forEach(task => updateTask(task));
      }
      return;
    }

    if (toBacklog) {
      const oldColumn = board.columns.find(col => {
        return !!col.tasks.find(task => task.id === taskId);
      });
      if (!oldColumn) return;
      const movedTask = oldColumn.tasks.find(task => task.id === taskId);
      if (!movedTask) return;
      const { newSource, newDestination } = moveTaskBetweenColumns(
        oldColumn.tasks,
        oldColumn.id,
        backlog,
        BACKLOG_ID,
        movedTask,
        index
      );
      oldColumn.tasks = newSource;
      movedTask.boardColumnId = null;
      movedTask.taskStateId = null;
      setBacklog([...newDestination]);
      setBoard({ ...board });
      oldColumn.tasks.forEach(task => updateTask(task));
      backlog.forEach(task => updateTask(task));
    }

    const oldColumn = board.columns.find(column => {
      return !!column.tasks.find(task => task.id === taskId);
    });
    if (!oldColumn) return;
    const movedTask = oldColumn.tasks.find(task => task.id === taskId);
    if (!movedTask) return;
    movedTask.boardColumnId = columnId;
    const newColumn = board.columns.find(column => column.id === columnId);
    if (!newColumn) return;
    if (oldColumn.id === newColumn.id) {
      moveInList(oldColumn.tasks, movedTask.position, index);
      setBoard({ ...board });
      oldColumn.tasks.forEach(task => updateTask(task));
    } else {
      movedTask.boardColumnId = columnId;
      const { newSource, newDestination } = moveTaskBetweenColumns(
        oldColumn.tasks,
        oldColumn.id,
        newColumn.tasks,
        newColumn.id,
        movedTask,
        index
      );
      oldColumn.tasks = newSource;
      newColumn.tasks = newDestination;
      oldColumn.tasks.forEach(task => updateTask(task));
      newColumn.tasks.forEach(task => updateTask(task));
    }
  };

  const handleColumnMoved = (id: string, index: number) => {
    const column = board.columns.find(column => column.id === id);
    if (!column) return;
    moveInList(board.columns, column.position, index);
    board.columns.forEach(column => updateColumn({ columnId: column.id, data: column }));
  };

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleColumnCreated = (title: string) => {
    createTaskState(
      {
        name: title,
        projectId
      },
      {
        onSuccess: taskState => {
          createColumn(
            {
              title,
              position: board.columns.length + 1,
              taskStateId: taskState.id,
              state: taskState
            },
            {
              onSuccess: column => {
                column.tasks = column.tasks ?? [];
                board.columns.push(column);
              }
            }
          );
        }
      }
    );
  };

  const handleColumnDeleted = (columnId: string) => {
    const deletedColumn = board.columns.find(column => column.id === columnId);
    if (!deletedColumn) return;
    board.columns = board.columns.filter(column => column.id !== columnId);
    setBoard({ ...board });
    deleteColumn(columnId);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId && destination.index === source.index)
    ) {
      setDragging(false);
      return;
    }

    const id = parseDndId(result.draggableId);

    switch (type) {
      case DroppableTypes.COLUMN:
        handleColumnMoved(id, destination.index);
        break;
      case DroppableTypes.CARD:
        handleCardMoved(id, parseDndId(destination.droppableId), destination.index);
        break;
      default:
    }
    setDragging(false);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <StrictModeDroppable
        droppableId='board'
        type={DroppableTypes.COLUMN}
        direction='horizontal'
        isDropDisabled={!dragging}
      >
        {({ innerRef, droppableProps, placeholder }) => (
          <Space
            style={{ height: '100%' }}
            ref={innerRef}
            align='start'
            {...droppableProps}
            size='middle'
          >
            <BacklogColumn tasks={backlog} updateTasks={setBacklog} />
            {board.columns
              .sort((a, b) => a.position - b.position)
              .map(column => {
                return (
                  <Draggable
                    key={column.id}
                    draggableId={`column:${column.id}`}
                    index={column.position}
                    isDragDisabled={dragging}
                  >
                    {provided => (
                      <div
                        key={column.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <BoardColumn
                          column={column}
                          onColumnDeleted={handleColumnDeleted}
                          onColumnUpdated={handleColumnUpdated}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
            {placeholder}
            <div style={{ width: '200px' }}>
              <AddNewItem onAdd={handleColumnCreated} toggleButtonText='Add column' />
            </div>
          </Space>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};
```

```ts
import { Draggable } from 'react-beautiful-dnd';
import { Button, Col, Popconfirm, Row, Space, Tooltip } from 'antd';
import { DeleteFilled, QuestionCircleOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { DroppableTypes } from '../../constants/DroppableTypes';
import { StrictModeDroppable } from '../dnd/StrictModeDroppable';
import { BoardColumnTask } from './BoardColumnTask';
import { AddNewItem } from './AddNewItem';
import { Task } from '../../models/task/Task';
import { useBoard } from '../../context/BoardContext';
import { TaskApi } from '../../api/taskApi';
import { reorder } from '../../helpers/drag';
import { BoardColumn as BoardColumnModel } from '../../models/board/BoardColumn';
import { BoardColumnApi } from '../../api/boardApi';

export type BoardColumnProps = {
  column: BoardColumnModel;
  onColumnDeleted: (columnId: string) => void;
  onColumnUpdated: (column: BoardColumnModel) => void;
};

export const BoardColumn = (props: BoardColumnProps) => {
  const [column, setColumn] = useState(props.column);
  const { id, title, tasks, taskStateId } = column;
  const { onColumnDeleted, onColumnUpdated } = props;
  const { projectId, userId } = useBoard();

  useEffect(() => {
    setColumn(props.column);
  }, [props.column]);

  const { mutate: createTask } = useMutation(TaskApi.create(projectId));
  const { mutate: updateTask } = useMutation(TaskApi.update(projectId));
  const { mutate: deleteTask } = useMutation(TaskApi.delete(projectId));
  const { mutate: updateColumn } = useMutation(BoardColumnApi.update(projectId));

  const handleTaskCreated = (title: string) => {
    createTask(
      {
        columnId: id,
        data: {
          boardColumnId: id,
          name: title,
          description: '',
          projectId,
          creatorId: userId,
          done: false,
          position: tasks.length + 1,
          taskStateId
        }
      },
      {
        onSuccess: task => {
          task.subtasks = task.subtasks ?? [];
          onColumnUpdated({ ...column, tasks: [...tasks, task] });
        }
      }
    );
  };

  const handleTaskUpdated = (taskId: string, task: Task) => {
    updateTask(task, {
      onSuccess: task => {
        tasks.forEach((t, i) => {
          if (t.id === taskId) {
            tasks[i] = task;
            setColumn({ ...column, tasks: [...tasks] });
            onColumnUpdated(column);
          }
        });
      }
    });
  };

  const handleTaskDeleted = (taskId: string) => {
    const deletedTask = tasks.find(task => task.id === taskId);
    if (!deletedTask) return;
    deleteTask(taskId);
    tasks.forEach(task => updateTask(task));
    onColumnUpdated({ ...column, tasks: [...reorder(tasks.filter(task => task.id !== taskId))] });
  };

  const handleColumnRenamed = (title: string) => {
    updateColumn({ columnId: id, data: { ...column, title } });
    onColumnUpdated({ ...column, title });
  };

  const tasksNode = (
    <Space direction='vertical' style={{ width: '100%' }}>
      {tasks
        .sort((a, b) => a.position - b.position)
        .map(task => {
          return (
            <Draggable key={task.id} draggableId={`task:${task.id}`} index={task.position}>
              {({ innerRef, draggableProps, dragHandleProps }) => (
                <div {...draggableProps} {...dragHandleProps} ref={innerRef}>
                  <BoardColumnTask
                    id={task.id}
                    columnId={id}
                    task={task}
                    onTaskDeleted={handleTaskDeleted}
                    onTaskEdited={handleTaskUpdated}
                  />
                </div>
              )}
            </Draggable>
          );
        })}
    </Space>
  );

  return (
    <StrictModeDroppable
      droppableId={`column:${id}`}
      type={DroppableTypes.CARD}
      direction='vertical'
    >
      {({ innerRef, droppableProps, placeholder }) => (
        <Space
          {...droppableProps}
          ref={innerRef}
          direction='vertical'
          style={{
            width: '275px'
          }}
        >
          <Row justify='space-between' align='middle'>
            <Col>
              <Title
                level={4}
                style={{ margin: 0, width: '225px' }}
                editable={{
                  triggerType: ['text'],
                  onChange: text => {
                    handleColumnRenamed(text);
                  }
                }}
                ellipsis={{ rows: 1 }}
              >
                {title}
              </Title>
            </Col>
            {id !== 'backlog' && (
              <Col>
                <Tooltip title='Delete Column' placement='left'>
                  <Popconfirm
                    title='Delete Task'
                    description='Are you sure you want to delete this task?'
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    okButtonProps={{ danger: true }}
                    okText='Yes'
                    cancelText='No'
                    onConfirm={() => onColumnDeleted(id)}
                  >
                    <Button type='primary' icon={<DeleteFilled />} danger size='small' />
                  </Popconfirm>
                </Tooltip>
              </Col>
            )}
          </Row>
          <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 250px)' }} className='scrollbar'>
            {tasksNode}
            {placeholder}
          </div>
          <AddNewItem onAdd={text => handleTaskCreated(text)} toggleButtonText='Add Task' />
        </Space>
      )}
    </StrictModeDroppable>
  );
};
```

```ts
    import { Card, Popconfirm, Progress, Space, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Title from 'antd/es/typography/Title';
import { Task } from '../../models/task/Task';
import { Subtask } from '../../models/task/Subtask';
import { TaskOverviewModal } from '../task/TaskOverviewModal';

type BoardColumnTaskProps = {
  id: string;
  columnId: string;
  task: Task;
  onTaskDeleted: (taskId: string, columnId: string | null) => void;
  onTaskEdited: (taskId: string, task: Task) => void;
};

const subtaskPercent = (subtasks: Subtask[]) => {
  const doneCount = subtasks.filter(subtask => subtask.done).length;
  return Math.round((doneCount / subtasks.length) * 100);
};

export const BoardColumnTask = ({
  id,
  columnId,
  task,
  onTaskDeleted,
  onTaskEdited
}: BoardColumnTaskProps) => {
  const { name, subtasks } = task;
  const [isTaskOverviewModalOpen, setIsTaskOverviewModalOpen] = useState(false);
  return (
    <>
      <TaskOverviewModal
        isOpen={isTaskOverviewModalOpen}
        close={() => setIsTaskOverviewModalOpen(false)}
        task={task}
        onTaskEdited={onTaskEdited}
        onTaskDeleted={onTaskDeleted}
      />
      <Card
        style={{ border: '1px solid #cfcfcf', maxWidth: '100%' }}
        bodyStyle={{ margin: '8px', padding: '8px', textAlign: 'left' }}
        actions={[
          <Tooltip key='edit' placement='bottom' title='Edit Task'>
            <EditOutlined onClick={() => setIsTaskOverviewModalOpen(true)} />
          </Tooltip>,
          <Tooltip key='delete' placement='bottom' title='Delete Task'>
            <Popconfirm
              title='Delete Task'
              description='Are you sure you want to delete this task?'
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okButtonProps={{ danger: true }}
              okText='Yes'
              cancelText='No'
              onConfirm={() => onTaskDeleted(id, columnId)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </Tooltip>
        ]}
      >
        <Space
          direction='vertical'
          style={{ width: '100%' }}
          onClick={() => setIsTaskOverviewModalOpen(true)}
        >
          <Title level={5} style={{ margin: '0', cursor: 'pointer' }}>
            {name}
          </Title>
          {subtasks.length > 0 && (
            <Progress
              percent={subtaskPercent(subtasks)}
              format={() =>
                `${subtasks.filter(subtask => subtask.done).length} / ${subtasks.length}`
              }
              style={{ width: '100%' }}
            />
          )}
        </Space>
      </Card>
    </>
  );
};
```
