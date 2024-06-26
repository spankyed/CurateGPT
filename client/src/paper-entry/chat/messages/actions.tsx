import React, { useEffect } from 'react';
import { IconButton,  Tooltip } from '@mui/material';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CachedIcon from '@mui/icons-material/Cached';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { messagesAtom } from './store';
import * as api from '~/shared/api/fetch';
import { addNewThreadAtom, branchThreadAtom, selectedThreadsAtom } from '../threads/store';
import { paperAtom } from '~/paper-entry/store';
import { StopCircleOutlined } from '@mui/icons-material';

const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || '';

const actions = [
  { name: 'regenerate', icon: <CachedIcon />, color:'#9c27b0' },
  { name: 'delete', icon: <DeleteForeverIcon />, color:'#e53935' },
  { name: 'show', icon: <VisibilityIcon />, color:'#43a047' },
  { name: 'hide', icon: <VisibilityOffIcon />, color:'#fdd835' },
  { name: 'thread', icon: <AltRouteIcon />, color:'#1e88e5' },
  { name: 'stop', icon: <StopCircleOutlined />, color:'yellow' },
];

export default function Actions({ message }) {
  const paper = useAtomValue(paperAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const branchThread = useSetAtom(branchThreadAtom);

  const filters = {
    regenerate: (m) => !m.streaming && m.role === 'assistant',
    show: (m) => !m.streaming && m.hidden,
    hide: (m) => !m.streaming && !m.hidden,
    thread: (m) => !m.streaming,
    delete: (m) => !m.streaming,
    // streaming actions below
    stop: (m) => m.streaming && m.role === 'assistant',
  }

  const filteredActions = actions.filter(action => filters[action.name] ? filters[action.name](message) : true);

  const handlers = {
    regenerate: async () => {
      // setMessages(messages.filter(m => m.id !== message.id));
      // const res = await api.regenerateMessage(message.id)
      // todo stream new message
    },
    stop: async () => {
      // setMessages(messages.filter(m => m.id !== message.id));
      // await api.stopMessage(message.id)
    },
    delete: async () => {
      setMessages(messages.filter(m => m.id !== message.id));
      await api.deleteMessage(message.id)
    },
    show: async () => {
      setMessages(messages.map(m => m.id === message.id ? { ...m, hidden: false } : m));
      await api.toggleHideMessage({
        messageId: message.id,
        state: false,
      });
    },
    hide: async () => {
      setMessages(messages.map(m => m.id === message.id ? { ...m, hidden: true } : m));
      await api.toggleHideMessage({
        messageId: message.id,
        state: true,
      });
    },
    thread: () => {
      branchThread(paper!.id, message);
    },
  }

  return (
    <>
      {
        filteredActions.map((action) => (
          <Tooltip title={capitalize(action.name)} key={action.name} placement='top'>
            <IconButton
              color='secondary'
              onClick={handlers[action.name]}
              sx={{
                ':first-child': {
                  ml: -1,
                },
                padding: '.3rem',
                // mr: .5,
                scale: '.8',
                '&:hover .MuiSvgIcon-root': { color: '#fff' },
              }}
            >
              {action.icon}
            </IconButton> 
          </Tooltip>
        ))
      }
    </>
  );
}

