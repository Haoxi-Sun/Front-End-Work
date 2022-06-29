import React, {useEffect, useState} from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function Increment({data}) {
    const [options, setOptions] = useState({
        title:{
            text: "",
        },
        yAxis:{
            title:{
                text: "Increment",
            }
        },
        xAxis:{
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
        },
        credits: {
            enabled: false,
          },
    });

    useEffect(() =>{
if(!data) return;

    }, [data]);
  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}
