import { Paper } from '~/shared/utils/types';
import { Tooltip } from "@mui/material";
import { getColorShadeRedToGreen } from '../../utils/getColorShade';

function Relevancy ({ paper, margin }: { paper: Paper, margin?: string }): React.ReactElement {
  return (
    <Tooltip title={`${(paper.relevancy * 100).toFixed(1)}%`}>
      <div
        style={{
          verticalAlign: 'middle',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '1px solid black',
          backgroundColor: getColorShadeRedToGreen(paper.relevancy),
          display: 'inline-block',
          margin: margin || '0 .65em 0 0',
        }}
      />
    </Tooltip>
  )
}

export default Relevancy;
