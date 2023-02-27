import React, {useEffect, useState} from 'react';
import {useStore} from "effector-react";
import {$accessToken, $tableData, setTableData, volatilityIndex} from "../store/store.js";

const getFormatDate = (date) => {
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

  return `${date.getFullYear()}-${month}-${day}`;
}
const msPerDay = 1000 * 60 * 60 * 24;

const dateForTable = [
  getFormatDate(new Date(Date.now() - 7 * msPerDay)),
  getFormatDate(new Date(Date.now() - 6 * msPerDay)),
  getFormatDate(new Date(Date.now() - 5 * msPerDay)),
  getFormatDate(new Date(Date.now() - 4 * msPerDay)),
  getFormatDate(new Date(Date.now() - 3 * msPerDay)),
  getFormatDate(new Date(Date.now() - 2 * msPerDay)),
  getFormatDate(new Date(Date.now() - msPerDay)),
  getFormatDate(new Date(Date.now())),
]


const Table = () => {
    const tableData = useStore($tableData)
    const [dates, setDates] = useState(dateForTable)
    const accessTokenStore = useStore($accessToken);

    useEffect(() => {
      if (accessTokenStore) {
        const requestOptions = {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': 'yiz6fHHDhaN6qcxZxaCGVXUHeiNvBMEb5fV2Pvt17RanWKWSHiEhliOMPxU5SM9X',
            'Authorization': `Bearer ${accessTokenStore}`,
            'Accept': "*/*"
          }
        };

        fetch(`http://ovz18.j90211046.px7zm.vps.myjino.ru/api/sales/`, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log('sales', data)
          });
      }

    }, [accessTokenStore]);

    useEffect(() => {
      if (accessTokenStore) {
        const requestOptions = {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': 'yiz6fHHDhaN6qcxZxaCGVXUHeiNvBMEb5fV2Pvt17RanWKWSHiEhliOMPxU5SM9X',
            'Authorization': `Bearer ${accessTokenStore}`,
            'Accept': "*/*"
          },
          query: {
            count_sales: 1000,
            date: (new Date()).toString(),
            page: 1,
            page_size: 10
          }
        };

        fetch(`http://ovz18.j90211046.px7zm.vps.myjino.ru/api/sales/analytic`, requestOptions).then(response => response.json())
          .then(data => {
            console.log('data', data)
            setTableData(data)

          });
      }
    }, [accessTokenStore]);


    const periodArray = [
      '-7',
      '-6',
      '-5',
      '-4',
      '-3',
      '-2',
      'Вчера',
      'Сегодня'
    ]

    const getClassName = (currentCountSales, prevCurrentCountSales) => {
      if (prevCurrentCountSales / currentCountSales > 1) {
        if (prevCurrentCountSales / currentCountSales > 1 + volatilityIndex) {
          return 'bg-red-600' // red
        }
        if (prevCurrentCountSales / currentCountSales < 1 + volatilityIndex) {
          return 'bg-red-800';  // алый
        }
      }

      if (currentCountSales / prevCurrentCountSales > 1) {
        if (currentCountSales / prevCurrentCountSales < 1 + volatilityIndex) {
          return 'bg-emerald-400' // салатавый
        }
        if (currentCountSales / prevCurrentCountSales > 1 + volatilityIndex) {
          return 'bg-green-500' // green
        }
      }

      return '';
    }


    return (
      <div className={'flex content-center justify-center h-96'}>
        <div>
          <div className={'flex ml-[274px]'}>
            {periodArray.map(date => (<div className=' w-[116px] my-8'>{date}</div>))}
          </div>
          <div>
            {tableData.map((dates) => {
              console.log('dates', dates)
              return <div className='flex'>
                <div className=''>
                  <div className='wrapper'>{dates[0].nm_id}</div>
                </div>
                {
                  (dates.map((date, index) => {
                        return (
                          <div key={index}
                               className={`element ${getClassName(date.count_sales, dates[index - 1]?.count_sales)}`}>
                            {date.count_sales}
                          </div>
                        )
                      }
                    )
                  )
                }
              </div>
            })}
          </div>
        </div>
      </div>
    );
  }
;

export default Table;
