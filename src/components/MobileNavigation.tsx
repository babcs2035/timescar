'use client';

import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import MapIcon from '@mui/icons-material/Map';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { text: 'Map', href: '/', icon: <MapIcon /> },
    { text: 'Ranking', href: '/ranking', icon: <LeaderboardIcon /> },
    { text: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  ];

  return (
    <>
      <IconButton
        color='inherit'
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor='right'
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: 280, backgroundColor: 'background.paper' },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Menu
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <List sx={{ pt: 0 }}>
          {menuItems.map(item => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={() => setOpen(false)}
                sx={{
                  py: 2,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
