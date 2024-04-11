import { Button } from "@mui/material";
// import { Paper } from '~/shared/utils/types';

// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
function Favorite ({ paper = {} }: { paper?: any }): React.ReactElement {
  return (
    <Button>
      {/* <Fab aria-label="like">
        {
          paper.isStarred 
            ? <FavoriteIcon color="error" />
            : <FavoriteBorderIcon color="action" />
        }
      </Fab> */}
      {
        paper.isStarred 
          ? <StarOutlinedIcon color="warning" />
          : <StarBorderOutlinedIcon color='warning' />
      }
    </Button>
  )
}

export default Favorite;
