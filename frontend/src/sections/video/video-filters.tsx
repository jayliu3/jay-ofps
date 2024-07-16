import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { Badge } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { types, regions, channels, languages } from 'src/modes/video';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import MultipleSelectChip from './multiple-select-chip';

// ----------------------------------------------------------------------

interface VideosFiltersProp {
  openFilter: boolean | undefined;
  onOpenFilter?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onCloseFilter?: (
    filterDatas: object,
    event?: object,
    reason?: 'backdropClick' | 'escapeKeyDown'
  ) => void;
}
export default function VideosFilters({
  openFilter,
  onOpenFilter,
  onCloseFilter,
}: VideosFiltersProp) {
  const [typesFilters, setTypesFilters] = useState<string[]>([]);
  const [channelsFilters, setChannelsFilters] = useState<string[]>([]);
  const [regionsFilters, setRegionsFilters] = useState<string[]>([]);
  const [languagesFilters, setLanguagesFilters] = useState<string[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(
      typesFilters.length + channelsFilters.length + regionsFilters.length + languagesFilters.length
    );
  }, [typesFilters, channelsFilters, regionsFilters, languagesFilters]);

  function handleClick(): void {
    setTypesFilters([]);
    setChannelsFilters([]);
    setRegionsFilters([]);
    setLanguagesFilters([]);
  }

  return (
    <>
      <Badge color="primary" badgeContent={count}>
        <Button
          disableRipple
          color="inherit"
          endIcon={<Iconify icon="ic:round-filter-list" />}
          onClick={onOpenFilter}
        >
          Filters&nbsp;
        </Button>
      </Badge>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={(event, reason) => {
          if (onCloseFilter !== undefined) {
            const filterDatas = {
              types: typesFilters,
              channels: channelsFilters,
              regions: regionsFilters,
              languages: languagesFilters,
            };
            onCloseFilter(filterDatas, event, reason);
          }
        }}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton
            onClick={(e) => {
              if (onCloseFilter !== undefined) {
                const filterDatas = {
                  types: typesFilters,
                  channels: channelsFilters,
                  regions: regionsFilters,
                  languages: languagesFilters,
                };
                onCloseFilter(filterDatas, e);
              }
            }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <MultipleSelectChip
              dicts={types}
              labelName="types"
              handleChange={(datas) => setTypesFilters(datas)}
              selectDicts={typesFilters}
            />
            <MultipleSelectChip
              dicts={channels}
              labelName="channels"
              handleChange={(datas) => setChannelsFilters(datas)}
              selectDicts={channelsFilters}
            />
            <MultipleSelectChip
              dicts={regions}
              labelName="regions"
              handleChange={(datas) => setRegionsFilters(datas)}
              selectDicts={regionsFilters}
            />
            <MultipleSelectChip
              dicts={languages}
              labelName="languages"
              handleChange={(datas) => setLanguagesFilters(datas)}
              selectDicts={languagesFilters}
            />
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="medium"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="material-symbols:cleaning-services-rounded" />}
            onClick={() => handleClick()}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
