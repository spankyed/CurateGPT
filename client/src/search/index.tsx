import React, { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { Button, Box, Accordion, AccordionSummary, AccordionDetails, Typography, Divider, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import './search.css';
import { resetFieldsAtom, resultListAtom, searchStateAtom, submitSearchAtom, tabValueAtom } from './store';
import PageLayout from '~/shared/components/layout/page-layout';
import PageMessage from '~/shared/components/page-message';
import ThumbPapersGrid from '~/date-entry/components/grid';
import PapersTable from '~/date-entry/components/table';
import QueryControl from './controls/query';
import BasicCriteriaControl from './controls/basic-criteria';
import DateRangeControl from './controls/date-range';
// import StateControl from './controls/state';
import { updatePaperInListAtom } from '~/shared/store';
import TocIcon from '@mui/icons-material/Toc';
import AppsIcon from '@mui/icons-material/Apps';

const SearchPage: React.FC<{}> = () => {

  return (
    <PageLayout padding={3}>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexDirection="row" gap={2} 
          style={{ margin: '0 15em 1em 15em' }}
        >
        <QueryControl />
      </Box>

      <Accordion defaultExpanded={true} sx={{ my: 3}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          style={{backgroundColor: 'rgb(30 32 34)'}}>
          <Typography>Additional Fields</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '1rem 2rem' }}>
          <div style={{ width: '40%' }} className='flex h-full justify-center self-center'>
              <DateRangeControl />
            </div>
            <div style={{  width: '10%', height: '5rem' }} className='flex h-full justify-center'>
              <Divider orientation="vertical" flexItem />
            </div>
            <div
              style={{
                width: '40%',
              }}
              className='flex justify-center '
            >
              <BasicCriteriaControl/>
            </div>



            {/* <StateControl /> */}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* <Divider sx={{ width: '100%', my: 2, marginTop: 4 }} /> */}

      {/* <Typography sx={{ width: '100%', mx: 2,  marginBottom: 2 }}>Results</Typography> */}

      <RenderByState />

    </PageLayout>
  );
}

const RenderByState = () => {
  const [searchState] = useAtom(searchStateAtom);
  // const searchState = 'loading';

  switch (searchState) {
    case 'pending':
      return <PageMessage message={'Define search criteria for papers'}/>;
    case 'loading':
      return <Results isLoading={true} />;
    case 'complete':
      return <Results />;
    case 'empty':
      return <PageMessage message={'No papers found'}/>;
    case 'error':
      return <PageMessage message={'Error occurred while fetching papers'}/>;
  }
}

const Results = ({ isLoading = false }) => {
  const [tabValue, setTabValue] = useAtom(tabValueAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: 'table' | 'grid') => {
    setTabValue(newValue);
  };
  const [results] = useAtom(resultListAtom);
  const updatePaper = useSetAtom(updatePaperInListAtom);

  useEffect(() => {
    const handlePaperUpdate = (event) => {
      const { id, changes } = event.detail;
      const { field, value } = changes;

      updatePaper({ papersListAtom: resultListAtom, id, field, newValue: value })
    }

    window.addEventListener('paperUpdate', handlePaperUpdate);

    return () => {
      window.removeEventListener('paperUpdate', handlePaperUpdate);
    };
  }, []);

  return (
    <Box>
      <div className='flex justify-center'>
        <ToggleButtonGroup
          color="secondary"
          value={tabValue}
          exclusive
          onChange={handleChange}
          aria-label="Data view"
          sx={{
            alignSelf: 'center',
          }}
        >
          <ToggleButton value="table"><TocIcon /></ToggleButton>
          <ToggleButton value="grid"><AppsIcon /></ToggleButton>
        </ToggleButtonGroup>
      </div>

      <Box>
        {tabValue === 'table' && <PapersTable papers={results} isLoading={isLoading} placeholderRows={10}/>}
        {tabValue === 'grid' &&
          <Box sx={{ marginTop: 2 }}>
            <ThumbPapersGrid papers={results} isLoading={isLoading} placeholderRows={4}/>
          </Box>  
        }
      </Box>
    </Box>
  );
}

export default SearchPage;
