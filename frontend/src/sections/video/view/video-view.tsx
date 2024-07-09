import { useState } from 'react';
import { format } from 'date-fns';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Paper } from '@mui/material';
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

import { FileInfo } from 'src/modes/fileInfo';
import { getFiles } from 'src/api/fileService';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

export default function VideoPage() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selectedAll, setSelectedAll] = useState([] as Array<number>);
  const [filterName] = useState('');

  const headLabel = [
    { id: 'name', label: 'name' },
    { id: 'localPath', label: 'localPath' },
    { id: 'size', label: 'size' },
    { id: 'createTime', label: 'createTime', align: 'center' },
    { id: 'fileType', label: 'fileType' },
    { id: '' },
  ];

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && pageFileInfos) {
      const newSelecteds = pageFileInfos.items.map((n) => n.id);
      setSelectedAll(newSelecteds);
      return;
    }
    setSelectedAll([]);
  };
  const handleSort = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };
  const handleClick = (event: React.ChangeEvent<HTMLInputElement>, name: number) => {
    const selectedIndex = selectedAll.indexOf(name);
    let newSelected: Array<number> = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedAll, name);
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
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };

  // Paging parameter
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  interface PageResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }
  interface PageFileInfos extends PageResponse {
    items: Array<FileInfo>;
  }
  const { data: pageFileInfos } = useQuery<PageFileInfos>({
    queryKey: ['getAllFileInfos', page, rowsPerPage],
    queryFn: () => getFiles(page, rowsPerPage),
    placeholderData: keepPreviousData,
  });
  if (!pageFileInfos) {
    return null;
  }

  console.log(pageFileInfos);
  const notFound = !pageFileInfos.items.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Videos</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="ic:baseline-upload" />}
        >
          upload
        </Button>
      </Stack>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedAll.length > 0 && selectedAll.length < pageFileInfos.items.length
                      }
                      checked={
                        pageFileInfos.items.length > 0 &&
                        selectedAll.length === pageFileInfos.items.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>

                  {headLabel.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={
                        (headCell.align || 'left') as
                          | 'center'
                          | 'left'
                          | 'right'
                          | 'inherit'
                          | 'justify'
                      }
                      sortDirection={(orderBy === headCell.id ? order : false) as SortDirection}
                      sx={{}}
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

              <TableBody>
                {pageFileInfos.items &&
                  pageFileInfos.items.map((row) => (
                    <>
                      <TableRow
                        hover
                        tabIndex={-1}
                        role="checkbox"
                        selected={selectedAll.indexOf(row.id) !== -1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            disableRipple
                            checked={selectedAll.indexOf(row.id) !== -1}
                            onChange={(e) => handleClick(e, row.id)}
                          />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {row.name}
                        </TableCell>

                        <TableCell>{row.localPath}</TableCell>

                        <TableCell>{row.size}</TableCell>

                        <TableCell align="center">
                          {format(new Date(row.createTime), 'yyyy-MM-dd HH:mm:ss')}
                        </TableCell>

                        <TableCell>{row.fileType}</TableCell>

                        <TableCell align="right">
                          <IconButton onClick={(e) => handleOpenMenu(e)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      <Popover
                        open={!!open}
                        anchorEl={open}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                          sx: { width: 140 },
                        }}
                      >
                        <MenuItem onClick={handleCloseMenu}>
                          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                          Edit
                        </MenuItem>

                        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
                          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                          Delete
                        </MenuItem>
                      </Popover>
                    </>
                  ))}

                {notFound && (
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          Not found
                        </Typography>

                        <Typography variant="body2">
                          No results found for &nbsp;
                          <strong>&quot;{filterName}&quot;</strong>.
                          <br /> Try checking for typos or using complete words.
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
          count={pageFileInfos.totalItems}
          rowsPerPage={rowsPerPage}
          onPageChange={(event, newPage) => handleChangePage(event, newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
