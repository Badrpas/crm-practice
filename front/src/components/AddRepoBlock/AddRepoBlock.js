import React, { useCallback, useState } from 'react';
import * as yup from 'yup';
import { Button } from '@material-ui/core';
import { FormInput } from '../FormInput';

const REGEXP = /^([\w-_]+)\/([\w-_]+)$/;
const scheme = yup.string().matches(REGEXP, 'Should be in format of "facebook/react"');

export const AddRepoBlock = ({ onSubmit, isLoading = false }) => {
  const [value, setValue] = useState('facebook/fbjs');
  const [errorMessage, setErrorMessage] = useState('');

  const onClick = useCallback(async () => {
    try {
      await scheme.validate(value);
      setErrorMessage('');
      const [, user, repoId] = REGEXP.exec(value);

      if (typeof onSubmit === 'function') {
        onSubmit(user, repoId);
      }
    } catch (e) {
      setErrorMessage(e.message);
    }
  }, [onSubmit, value]);

  return (
    <div className="add-repo-block">
      <form onSubmit={e => e.preventDefault()}>
        <FormInput
          disabled={isLoading}
          value={value}
          setter={setValue}
          error={!!errorMessage}
          helperText={errorMessage}
          // variant="filled"
        >
          User/Repo
        </FormInput>

        <div>
          <Button
            disabled={isLoading}
            type="submit"
            variant="contained"
            color="secondary"
            disableElevation
            {...{onClick}}
          >
            {isLoading ? 'Wait...' : 'Add Repo'}
          </Button>
        </div>
      </form>
    </div>
  );
};