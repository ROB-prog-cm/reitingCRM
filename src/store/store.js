import {createStore, createEvent} from "effector";

const refreshToken = createEvent();
const accessToken = createEvent();
const setTableData = createEvent();

export const volatilityIndex = 0.1;

const $refreshToken = createStore("")
  .on(refreshToken, (_, newRefreshToken) => newRefreshToken);

const $accessToken = createStore("")
  .on(accessToken, (_, newAccessToken) => newAccessToken);

const $tableData = createStore([])
  .on(setTableData, (_, newTableData) => newTableData);

export {$refreshToken, $accessToken, refreshToken, accessToken, $tableData, setTableData};



