import React, { useCallback } from 'react';
import {
  TableContainer,
  Table as MaterialTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from '@material-ui/core';
import './Table.scss';
import { Refresh, Delete } from '@material-ui/icons'
import Link from '@material-ui/core/Link';
import { observer } from 'mobx-react-lite';

export const Table = observer(({reposInProgress, repos = [], onUpdateClick, onRemoveClick}) => {
  const isRepoLoading = useCallback((repo) => {
    return reposInProgress[repo.ownerName + '/' + repo.projectName];
  }, [reposInProgress]);

  return (
    <TableContainer className='table-container'>
      <MaterialTable>
        <TableHead>
          <TableRow>
            <TableCell>Owner</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Star count</TableCell>
            <TableCell>Fork count</TableCell>
            <TableCell>Issue count</TableCell>
            <TableCell>Date created</TableCell>
            <TableCell/>
          </TableRow>
        </TableHead>
        <TableBody>
          {repos.map(repo => (
            <TableRow key={repo.id} className={isRepoLoading(repo) ? 'is-loading' : null}>
              <TableCell component="th">{repo.ownerName}</TableCell>
              <TableCell component="th">{repo.projectName}</TableCell>
              <TableCell component="th">
                <Link href={repo.url} target="_blank" disabled={repo.isLoading}>{repo.url}</Link>
              </TableCell>
              <TableCell component="th">{repo.starCount}</TableCell>
              <TableCell component="th">{repo.forkCount}</TableCell>
              <TableCell component="th">{repo.issueCount}</TableCell>
              <TableCell component="th">{repo.creationDate}</TableCell>
              <TableCell component="th">
                <Link component="button" onClick={() => onUpdateClick(repo)} disabled={repo.isLoading}>
                  <Refresh/>
                </Link>
                <Link component="button" onClick={() => onRemoveClick(repo)} disabled={repo.isLoading}>
                  <Delete/>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </MaterialTable>
    </TableContainer>
  );

});

