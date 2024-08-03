import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import { Badge } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useTypes, useRegions, useChannels, useLanguages } from 'src/modes/video';

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
  const Regions = useRegions();
  const Types = useTypes();
  const Channels = useChannels();
  const Languages = useLanguages();
  const { t } = useTranslation();
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
          {t('Filters')}&nbsp;
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
            {t('Filters')}
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
              dicts={Types}
              labelName={t('Type')}
              handleChange={(datas) => setTypesFilters(datas)}
              selectDicts={typesFilters}
            />
            <MultipleSelectChip
              dicts={Channels}
              labelName={t('Channel')}
              handleChange={(datas) => setChannelsFilters(datas)}
              selectDicts={channelsFilters}
            />
            <MultipleSelectChip
              dicts={Regions}
              labelName={t('Region')}
              handleChange={(datas) => setRegionsFilters(datas)}
              selectDicts={regionsFilters}
            />
            <MultipleSelectChip
              dicts={Languages}
              labelName={t('Language')}
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
            {t('Clear All')}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
