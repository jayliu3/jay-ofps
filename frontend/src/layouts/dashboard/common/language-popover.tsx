import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------

const LANGS = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/flag/en.svg',
  },
  {
    value: 'cn',
    label: '中文',
    icon: '/assets/icons/flag/cn.svg',
  },
  {
    value: 'nz',
    label: 'Maori',
    icon: '/assets/icons/flag/nz.svg',
  },
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(null as null | HTMLButtonElement);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const changeLanguage = (lang: string | undefined) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={(e) => handleOpen(e)}
        sx={{
          width: 40,
          height: 40,
          bgcolor: open ? 'action.selected' : 'inherit',
        }}
      >
        <img src={LANGS.find((lang) => lang.value === i18n.language)?.icon} alt="language" />
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 180,
          },
        }}
      >
        {LANGS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === i18n.language}
            onClick={() => changeLanguage(option.value)}
            sx={{ typography: 'body2', py: 1 }}
          >
            <Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />
            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
