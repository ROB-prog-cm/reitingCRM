import React, {useEffect} from 'react';
import {$accessToken, setTableData} from "../store/store.js";
import {useStore} from "effector-react";

const ButtonTypes = {
  salesLeaderButYesterdayLoosed: 'salesLeaderButYesterdayLoosed',
  salesLeaderButYesterdayWinner: 'salesLeaderButYesterdayWinner',
  salesWasButYesterdayLoosed: 'salesWasButYesterdayLoosed',
  salesWasButRemnantsExists: 'salesWasButRemnantsExists',
  general: 'general',
}

const volatilityIndex = 0.1;

const getFilteredTableDataFunctions = {
  [ButtonTypes.salesLeaderButYesterdayLoosed]: (tableData) => {
    return tableData.filter((dates) => {
      const yesterdaySalesCount = dates[dates.length - 2]?.count_sales;
      const dayBeforeYesterdaySalesCount = dates[dates.length - 3]?.count_sales;

      return dayBeforeYesterdaySalesCount / yesterdaySalesCount > 1 + volatilityIndex;
    })
  },
  [ButtonTypes.salesLeaderButYesterdayWinner]: (tableData) => {
    return tableData.filter((dates) => {
      const yesterdaySalesCount = dates[dates.length - 2]?.count_sales;
      const dayBeforeYesterdaySalesCount = dates[dates.length - 3]?.count_sales;

      return yesterdaySalesCount / dayBeforeYesterdaySalesCount > 1 + volatilityIndex;
    })
  },
  [ButtonTypes.salesWasButYesterdayLoosed]: (tableData) => {
    return tableData.filter((dates) => {
      const yesterdaySalesCount = dates[dates.length - 2]?.count_sales;
      const allDateSalesCount = dates.reduce((acc, curr) => acc + curr.count_sales, 0);

      return (yesterdaySalesCount === 0) && allDateSalesCount > 5;
    })
  },
  [ButtonTypes.salesWasButRemnantsExists]: (tableData) => {
    return tableData;
  },
  [ButtonTypes.general]: (tableData) => {
    return tableData;
  },
}

const getSortedTableDataFunctions = {
  [ButtonTypes.salesLeaderButYesterdayLoosed]: (tableData) => {
    const newTableData = [...tableData];

    newTableData.sort((datesA, datesB) => {
      const dayBeforeYesterdaySalesCountA = datesA[datesA.length - 3]?.count_sales;
      const dayBeforeYesterdaySalesCountB = datesB[datesB.length - 3]?.count_sales;

      return dayBeforeYesterdaySalesCountA - dayBeforeYesterdaySalesCountB;
    })

    return newTableData;
  },
  [ButtonTypes.salesLeaderButYesterdayWinner]: (tableData) => {
    const newTableData = [...tableData];

    newTableData.sort((datesA, datesB) => {
      const dayBeforeYesterdaySalesCountA = datesA[datesA.length - 3]?.count_sales;
      const dayBeforeYesterdaySalesCountB = datesB[datesB.length - 3]?.count_sales;

      return dayBeforeYesterdaySalesCountA - dayBeforeYesterdaySalesCountB;
    })

    return newTableData;
  },
  [ButtonTypes.salesWasButYesterdayLoosed]: (tableData) => {
    const newTableData = [...tableData];

    newTableData.sort((datesA, datesB) => {
      const dayBeforeYesterdaySalesCountA = datesA[datesA.length - 3]?.count_sales;
      const dayBeforeYesterdaySalesCountB = datesB[datesB.length - 3]?.count_sales;

      return dayBeforeYesterdaySalesCountA - dayBeforeYesterdaySalesCountB;
    })

    return newTableData;
  },
  [ButtonTypes.salesWasButRemnantsExists]: (tableData) => {
    return [...tableData];
  },
  [ButtonTypes.general]: (tableData) => {
    return [...tableData];
  },
}

const getSortedAndFilteredTableData = (type, tableData) => {
  const filteredTableData = getFilteredTableData(type, tableData);

  return getSortedTableData(type, filteredTableData);
}

const getFilteredTableData = (type, tableData) => {
  return getFilteredTableDataFunctions[type](tableData);
}

const getSortedTableData = (type, tableData) => {
  return getSortedTableDataFunctions[type](tableData);
}


const Sales = () => {
  const accessTokenStore = useStore($accessToken);
  const onFilterClick = (type) => {
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
        const sortedAndFilteredData = getSortedAndFilteredTableData(type, data);

        setTableData(sortedAndFilteredData);
      });
  }

  useEffect(() => {
    onFilterClick(ButtonTypes.general);
  }, []);


  return (
    <div style={{alignItems: 'center'}}
         className='flex content-center justify-center mt-20'>
      <span onClick={() => onFilterClick(ButtonTypes.salesLeaderButYesterdayWinner)}
            className='w-1/10 mx-8 cursor-pointer'>Лидеры продаж, но заказы упали</span>
      <span onClick={() => onFilterClick(ButtonTypes.salesWasButRemnantsExists)}
            className='w-1/10 mx-8 cursor-pointer'>Лидеры продаж, но заказы выросли</span>
      <span onClick={() => onFilterClick(ButtonTypes.salesLeaderButYesterdayWinner)}
            className='w-1/10 mx-8 cursor-pointer'>Продажи были вчера на нуле</span>
      <span onClick={() => onFilterClick(ButtonTypes.salesWasButYesterdayLoosed)}
            className='w-1/10 mx-8 cursor-pointer'>Максимальные остатки, продаж нет</span>
      <span onClick={() => onFilterClick(ButtonTypes.general)} className='w-1/10 mx-8 cursor-pointer'>Общая</span>
      <button className='
       w-[158px]
       h-[48px]
       bg-emerald-500
       rounded-lg
       text-sm
       mr-4
       text-white'
      >Exсel
      </button>
      <button className='
        w-[158px]
        h-[48px]
        text-sm
        bg-emerald-500
        rounded-lg
        text-white'
      >Поделиться
      </button>
    </div>
  );
};

export default Sales;
