import React, { useEffect, useState } from 'react'
import Papers from '../../components/paper/Papers'
import Box from '@mui/material/Box'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Tab,
} from '@mui/material'
import TableDefault from '../../components/table/TableDefault'
import SelectViewer from '../../components/select-viewer/SelectViewer'
import BasicDateRangePicker from '../../components/date-range/DateRangePicker'
import Searches from '../../components/input/search/Searches'
import ContainedButton from '../../components/input/button/ContainedButton'
import axios from 'axios'
import { API } from '../../configs/api'
import { LOGGER, strDot } from '../../utils/common'
import TableDefaultUserManaging from '../../components/table/TableDefaultUserManaging'
import { net } from '../../configs/net'

const tableSet = [
  {
    field: 'id',
  },
  {
    field: 'createdat',
  },
  {
    field: 'username',
  },
  {
    field: 'itemid',
  },
  {
    field: 'amount',
  },
  {
    field: 'currency',
  },
  {
    field: 'statusstr',
  },
  {
    field: 'roundnumber',
  },
  {
    field: 'txhash',
  },
  {
    field: 'nettype',
  },
]

const testField = [
  {
    field: '1',
  },
  {
    field: 'Moong #11',
  },
  {
    field: '100 USDT',
  },
  {
    field: 'Success',
  },
  {
    field: '100',
  },
  {
    field: 'https://nip1.net',
  },
  {
    field: '2022-02-02',
  },
  {
    field: '2022-02-02',
  },
  {
    field: '2022-02-02',
  },
]

const MatchingStatus = () => {
  const [value, setValue] = React.useState('1')
  let [listlist, setlistlist] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [rows, setRows] = useState<any>(10)
  const [searchkey, setSearchKey] = useState<any>('')
  const handleRows = (event: SelectChangeEvent<{ value: any }>) => {
    setRows(event.target.value)
  }

  const fetchData = () => {
    axios
      .get(
        API.API_LOGSALES +
          `/${net}/${page * rows}/${rows}/id/DESC?nettype=${net}`,
        {
          params: { date0: value[0], date1: value[1], searchkey },
        },
      )
      .then((resp) => {
        LOGGER('', resp.data)
        // setCount(resp.data.payload.count as number)
        let { status, list: list_raw } = resp.data

        if (status == 'OK') {
          let list = list_raw.map((elem: any, index: any) => {
            return [
              { field: elem['id'] },
              { field: strDot(elem['createdat'], 10) },
              { field: elem['username'] },
              { field: elem['itemid'] },
              { field: parseInt(elem['amount']).toFixed(2) },
              { field: elem['currency'] },
              { field: elem['statusstr'] },
              { field: elem['roundnumber'] },
              { field: elem['txhash'] },
              { field: elem['nettype'] },
            ]
          })
          LOGGER('', list)
          setlistlist(list)
          setTotalPages(Math.ceil((resp.data.payload.count as number) / rows))
        }
      })
  }
  useEffect(() => {
    fetchData()
  }, [page, rows, value, searchkey])

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  return (
    <>
      <Papers>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="결제완료" value="1" />
              </TabList>
            </Box>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '1rem',
                justifyContent: 'space-between',
              }}
            >
              <article
                style={{
                  width: '150px',
                }}
              >
                <Select id="RowsSelectLabel" value={rows} onChange={handleRows}>
                  <MenuItem value={10}>10개씩 보기</MenuItem>
                  <MenuItem value={20}>20개씩 보기</MenuItem>
                </Select>
              </article>

              <article
                style={{
                  marginLeft: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '700px',
                }}
              >
                <BasicDateRangePicker
                  dateState={(value) => {
                    console.log(value)
                  }}
                />
                <Searches searchState={(e) => console.log(e)} />
                <ContainedButton subject="EXCEL" />
              </article>
            </div>
            <TabPanel value="1">
              <TableDefaultUserManaging
                listlist={listlist}
                columns={tableSet}
                testFields={testField}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  margin: '20px 0 0 0',
                }}
              >
                {totalPages > 1 ? (
                  <Pagination
                    onChange={(e, v) => {
                      setPage(v - 1)
                    }}
                    count={totalPages}
                  />
                ) : (
                  ''
                )}
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </Papers>
    </>
  )
}

export default MatchingStatus
