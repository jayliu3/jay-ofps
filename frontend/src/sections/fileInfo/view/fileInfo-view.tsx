import { format } from 'date-fns';
import { useState, useEffect, ChangeEvent } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import TableCell, { SortDirection } from '@mui/material/TableCell';
import {
  Paper,
  Dialog,
  Toolbar,
  Tooltip,
  DialogActions,
  DialogContent,
  OutlinedInput,
  InputAdornment,
  CircularProgress,
  DialogContentText,
} from '@mui/material';

import { useNotification } from 'src/hooks/notification-context';

import { formatFileSize } from 'src/utils/format-number';
import { SelectAllFileInfos } from 'src/utils/string-pool';

import { pages } from 'src/modes/pages';
import { FileInfo } from 'src/modes/fileInfo';
import { getFiles, deleteFiles } from 'src/api/file-service';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { LightTooltip } from 'src/components/utils/light-tooltip';

export default function FileInfoPage() {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('CreateTime');
  const [selectedAll, setSelectedAll] = useState([] as Array<number>);
  const [fileInfos, setFileInfos] = useState([] as Array<FileInfo>);
  const { showNotification } = useNotification();

  const headLabel = [
    { id: 'Id', label: 'Id' },
    { id: 'Name', label: 'name' },
    { id: 'LocalPath', label: 'localPath' },
    { id: 'Size', label: 'size', width: 130, minWidth: 130 },
    { id: 'CreateTime', label: 'createTime', align: 'center', width: 180, minWidth: 180 },
    { id: 'FileType', label: 'fileType' },
    { id: '' },
  ];

  const handleFilterByName = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const [filterName, setFilterName] = useState('');

  const handleSort = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };
  const handleClick = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const selectedIndex = selectedAll.indexOf(id);
    let newSelected: Array<number> = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedAll, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedAll.slice(1));
    } else if (selectedIndex === selectedAll.length - 1) {
      newSelected = newSelected.concat(selectedAll.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedAll.slice(0, selectedIndex),
        selectedAll.slice(selectedIndex + 1)
      );
    }
    setSelectedAll(newSelected);
  };

  const [open, setOpen] = useState(null as null | HTMLButtonElement);
  const [MenuId, setMenuId] = useState(0 as number);
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setOpen(event.currentTarget);
    setMenuId(id);
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };

  // Paging parameter
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const {
    data: pageFileInfos,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<pages<FileInfo>>({
    queryKey: [SelectAllFileInfos, page, rowsPerPage, orderBy, order, filterName],
    queryFn: () =>
      getFiles({
        pageNumber: page,
        pageSize: rowsPerPage,
        sortField: orderBy,
        sortOrder: order,
        name: filterName,
      }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isLoading && !isError && pageFileInfos) {
      setFileInfos(pageFileInfos.items);
      setTotalItems(pageFileInfos.totalItems);
    }
  }, [pageFileInfos, isLoading, isError]);

  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: deleteFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SelectAllFileInfos] });
    },
  });
  const handleDeleteMenu = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: number) => {
    setDeleteIds([id]);
    setOpenDialog(true);
    handleCloseMenu();
  };
  const [deleteIds, setDeleteIds] = useState([] as number[]);
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = (event?: object, reason?: string) => {
    if ((reason && reason === 'backdropClick') || reason === 'escapeKeyDown') {
      return;
    }
    setOpenDialog(false);
    setDeleteIds([]);
  };
  const handleConfirmDelete = () => {
    mutate(deleteIds, {
      onSuccess: ({ deletedIds }) => {
        handleCloseDialog();
        showNotification('删除成功', 'success');
        const updatedSelectedAll = selectedAll.filter((id) => !deletedIds.includes(id));
        setSelectedAll(updatedSelectedAll);
      },
      onError: () => {
        showNotification('删除失败', 'error');
      },
    });
  };

  const handleDeleteIcon = (ids: number[]) => {
    setDeleteIds(ids);
    setOpenDialog(true);
  };
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">FileInfo</Typography>
      </Stack>

      <Card>
        <Toolbar
          sx={{
            height: 60,
            display: 'flex',
            justifyContent: 'space-between',
            p: (theme) => theme.spacing(0, 1, 0, 3),
            ...(selectedAll.length > 0 && {
              color: 'primary.main',
              bgcolor: 'primary.lighter',
            }),
          }}
        >
          {selectedAll.length > 0 ? (
            <Typography component="div" variant="subtitle1">
              {selectedAll.length} selected
            </Typography>
          ) : (
            <OutlinedInput
              size="small"
              value={filterName}
              onChange={(e) => handleFilterByName(e)}
              placeholder="Search"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled', width: 20, height: 20 }}
                  />
                </InputAdornment>
              }
            />
          )}
          {selectedAll.length > 0 && (
            <Tooltip title="Delete">
              <IconButton onClick={() => handleDeleteIcon(selectedAll)}>
                <Iconify icon="eva:trash-2-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow key={-1}>
                  <TableCell padding="checkbox" />

                  {headLabel.map((headCell) => (
                    <TableCell
                      align={
                        (headCell.align || 'left') as
                          | 'center'
                          | 'left'
                          | 'right'
                          | 'inherit'
                          | 'justify'
                      }
                      sortDirection={(orderBy === headCell.id ? order : false) as SortDirection}
                      sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                    >
                      <TableSortLabel
                        hideSortIcon
                        active={orderBy === headCell.id}
                        direction={(orderBy === headCell.id ? order : 'asc') as 'asc' | 'desc'}
                        onClick={(event) => handleSort(event, headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box
                            sx={{
                              border: 0,
                              margin: -1,
                              padding: 0,
                              width: '1px',
                              height: '1px',
                              overflow: 'hidden',
                              position: 'absolute',
                              whiteSpace: 'nowrap',
                              clip: 'rect(0 0 0 0)',
                            }}
                          >
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody
                sx={{
                  '& .MuiTableCell-root': {
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  },
                }}
              >
                {isSuccess &&
                  fileInfos &&
                  fileInfos.map((row) => (
                    <TableRow
                      hover
                      tabIndex={-1}
                      role="checkbox"
                      selected={selectedAll.indexOf(row.id) !== -1}
                      key={row.id}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          disableRipple
                          checked={selectedAll.indexOf(row.id) !== -1}
                          onChange={(e) => handleClick(e, row.id)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>

                      <TableCell sx={{ maxWidth: 200 }}>
                        <LightTooltip title={row.name} placement="bottom-start">
                          <Typography component="span">{row.name}</Typography>
                        </LightTooltip>
                      </TableCell>

                      <TableCell sx={{ maxWidth: 200 }}>
                        <LightTooltip title={row.localPath} placement="bottom-start">
                          <Typography component="span">{row.localPath}</Typography>
                        </LightTooltip>
                      </TableCell>

                      <TableCell>{formatFileSize(row.size)}</TableCell>

                      <TableCell align="center">
                        {format(new Date(row.createTime), 'yyyy-MM-dd HH:mm:ss')}
                      </TableCell>

                      <TableCell>{row.fileType}</TableCell>

                      <TableCell align="right">
                        <IconButton onClick={(e) => handleOpenMenu(e, row.id)}>
                          <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {isSuccess && fileInfos.length === 0 && (
                  <TableRow>
                    <TableCell align="center" colSpan={headLabel.length} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          Not found
                        </Typography>

                        <Typography variant="body2">No results found.</Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                )}
                {isLoading && (
                  <TableRow>
                    <TableCell align="center" colSpan={headLabel.length} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          Loading...
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                )}
                {isError && (
                  <TableRow>
                    <TableCell align="center" colSpan={headLabel.length} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          Error
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          onPageChange={(event, newPage) => handleChangePage(event, newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Dialog open={!!openDialog} onClose={handleCloseDialog} disableEscapeKeyDown={false}>
        <DialogContent>
          <DialogContentText>
            <Typography sx={{ mx: { md: 10, xs: 2 } }} variant="body1">
              Are you sure to delete?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => handleCloseDialog(e)} color="primary" autoFocus>
            Cancel
          </Button>
          <Box sx={{ m: 1, position: 'relative' }}>
            <Button onClick={handleConfirmDelete} color="error" disabled={isPending}>
              Delete
            </Button>
            {isPending && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 140 },
          },
        }}
      >
        <MenuItem onClick={(e) => handleDeleteMenu(e, MenuId)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </Container>
  );
}
