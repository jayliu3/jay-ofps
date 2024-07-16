import * as React from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { Dict, getLabelById } from 'src/utils/format-dicts';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, selectDicts: readonly string[], theme: Theme) {
  return {
    fontWeight:
      selectDicts.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightBold,
  };
}

interface MultipleSelectChipProp {
  dicts: Dict[];
  labelName: string;
  handleChange: (datas: string[]) => void;
  selectDicts: string[];
}
export default function MultipleSelectChip({
  dicts,
  labelName,
  handleChange,
  selectDicts,
}: MultipleSelectChipProp) {
  const theme = useTheme();

  const _handleChange = (event: SelectChangeEvent<typeof selectDicts>) => {
    const {
      target: { value },
    } = event;
    handleChange(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div>
      <FormControl fullWidth size="small">
        <InputLabel id="multiple-chip-label">{labelName}</InputLabel>
        <Select
          labelId="multiple-chip-label"
          id="multiple-chip"
          multiple
          value={selectDicts}
          onChange={_handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={labelName} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={getLabelById(dicts, value)} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {dicts.map((dict) => (
            <MenuItem key={dict.id} value={dict.id} style={getStyles(dict.id, selectDicts, theme)}>
              {dict.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
