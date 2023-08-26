import React, { useContext, useState } from 'react';
import { Box, Typography, ImageList, ImageListItem, Button, Pagination } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../index';
import { Paper, StoreType } from '../shared/store';
import { observer } from 'mobx-react-lite';
import Thumbnail from '~/shared/components/Thumbnail';
import EmptyState from '~/shared/components/Empty';
import Scraping from '~/shared/components/Scraping';

const Papers: React.FC = observer(() => {
  const store = useContext<StoreType>(StoreContext);
  const navigate = useNavigate();
  const { state, papersList, selectedDay, selectDay} = store.dashboard;
  
  function reformatDate(inputDate: string): string {
    const date = new Date(inputDate);
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: '2-digit'
    });
  
    // Split the formatted string to extract the weekday, month, and day
    const [weekday, month, day] = formatted.split(' ');
  
    return `${weekday} ${month} ${day}`;
  }
  
  const onDayClick = day => (e) => {
    navigate(`/day/${day}`);
  }

  return (
    <>
      {papersList.map(({ day, papers }) => (
        <Box 
          key={day} 
          onMouseEnter={() => selectDay(day)}
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
            paddingTop: 2,  
            paddingBottom: 2,
            backgroundColor: selectedDay === day ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
            cursor: 'pointer',
          }}
          // onClick={onDayClick(day)}
        >
          <Typography variant="h5" style={{ textDecoration: 'none', marginBottom: 4 }} >
            {reformatDate(day)}
          </Typography>
          {
            papers.length === 0 
            ? <Empty day={day}/> 
            : papers.length === 0 
              ? <Scraping />
              : <PapersList papers={papers} />
          }
        </Box>
      ))}
    </>
  );
})

function PapersList2({ papers }: { papers: Paper[] }): React.ReactElement {
  return (
    <>
      <ImageList cols={[...papers].splice(1).length} sx={{ padding: 3 }}>
        {[...papers].splice(1).map(paper => (
          <ImageListItem sx={{ margin: 2 }} key={paper.id}>
            <Thumbnail paper={paper} />
          </ImageListItem>
        ))}
      </ImageList>

    </>
  )
}
const totalImages = 22;
const imagesPerPage = 4;

const images = Array.from({ length: totalImages }).map((_, index) => ({
  id: index,
  src: `https://via.placeholder.com/250x300?text=Image+${index + 1}`,
  alt: `Image ${index + 1}`,
}));
function PapersList({ papers }: { papers: Paper[] }): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);

  const handlePageChange = (event, value) => {
    setPreviousPage(currentPage);
    setCurrentPage(value);
  };

  // page 1 : 0 - 3
  // page 2 : 4 - 7
  // page 3 : 8 - 11
  // const startImage = (currentPage - 1) * imagesPerPage;
  // const endImage = startImage + (imagesPerPage * 2);
  // const visibleImages = images.slice(startImage, endImage);
  // console.log('startImage, endImage: ', {startImage, endImage, visibleImages});

  return (
    <div className="carousel-container">
      <div
        className="carousel-wrapper"
        style={{ transform: `translateX(-${(currentPage - 1) * 100}%)` }}
      >
        {
          images.map((image, index) => {
            const isCurrentPage = index >= (currentPage - 1) * imagesPerPage && index < currentPage * imagesPerPage;
            const isPreviousPage = index >= (previousPage - 1) * imagesPerPage && index < previousPage * imagesPerPage;
            
            const isOffscreen = !isCurrentPage && !isPreviousPage;

            return (
            <img
              key={index}
              src={`https://via.placeholder.com/250x300?text=Image+${index + 1}`}
              alt={`Image ${index + 1}`}
              className={isOffscreen ? 'offscreen-image' : ''}
            />
            )
          })
        }
      </div>
      <Pagination
        count={Math.ceil(totalImages / imagesPerPage)}
        variant="outlined"
        shape="rounded"
        page={currentPage}
        onChange={handlePageChange}
      />
    </div>
  ); 
}

function Empty({ day }: { day: string }): React.ReactElement {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} margin={3}>
      <EmptyState day={day}/>
    </Box>
  );
}

export default Papers;
