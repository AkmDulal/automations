import React, { useEffect, useState } from "react"
import './App.css';

import DataTable from 'react-data-table-component';
import { makeStyles } from "@mui/styles"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import Swal from "sweetalert2"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import { IconButton } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import Data from "./data.json"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: 400,
  bgcolor: "background.paper",
  border: "1px solid #7367f0",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4
}
const useStyles = makeStyles({
  modalStyle1: {
    position: "absolute",
    top: "50%",
    left: "50%",
    overflowX: "hidden",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "100%"
    },
    minHeight: "fit-content",
    maxHeight: "70%",
    display: "flex",
    flexDirection: "column"
  },
  myClassName: {
    backgroundColor: "rgb(234 192 255)",
    position: "relative",
    "&:hover": {
      backgroundColor: "rgb(182 52 255 / 61%)"
    }
  }


})

const columns = [
  {
    name: 'Sl',
    sortable: true,
    selector: row => row?.id,
  },
  {
    name: 'Name',
    sortable: true,
    selector: row => row?.name,
  },
  {
    name: 'Code',
    sortable: true,
    selector: row => row?.code,

  },
  {
    name: 'Availability',
    sortable: true,
    cell: (row) => (
      <>
        {row?.availability === undefined ? <> ~  </> : <>
          <div className={`${row?.availability}` === "true" ? "true" : "false"}>
            {`${row?.availability}`}
          </div>
        </>}
      </>
    )
  },
  {
    name: 'Need to repair',
    sortable: true,
    cell: (row) => (
      <>
        {row?.needing_repair === undefined ? <> ~  </> : <>
          <div className={`${row?.needing_repair}` === "true" ? "true" : "false"}>
            {`${row?.needing_repair}`}
          </div>
        </>}
      </>
    )
  },
  {
    name: 'Durability',
    sortable: true,
    selector: row => row?.durability,
  },
  {
    name: 'Price',
    sortable: true,
    selector: row => row?.price,
  },
  {
    name: 'Mileage',
    sortable: true,
    cell: (row) => (
      <>
        {row?.mileage === null ? <> ~  </> : <>   {`${row?.mileage}`} </>}
      </>
    )
  },
  {
    name: 'Minimum Rent Period',
    sortable: true,
    cell: (row) => (
      <>
        {row?.minimum_rent_period}
      </>
    )
  },
];

//  Internally, customStyles will deep merges your customStyles with the default styling.
const customStyles = {
  rows: {
    style: {
      minHeight: '50px', // override the row height
      fontWeight: "600"
    },
  },
  headCells: {
    style: {
      paddingLeft: '8px', // override the cell padding for head cells
      paddingRight: '8px',
      background: '#db2164',
      fontWeight: "bold",
      color: "#fff"
    },
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
      paddingTop: '0',
    },
  },
};


function App() {
  const [open, setOpen] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  const [data, setData] = useState([])
  const [nameList, setNameList] = useState([])
  const [dropDownList, setDropDownList] = useState([]);
  const [startDate, setStartDate] = useState([]);
  const [endtDate, setEndDate] = useState([]);
  const [meterDate, setMeterDate] = useState('');
  const [meterInputFile, setMeterInputFile] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setOpenReturn(false);
    setMeterInputFile(false);
  };
  const bookingSubmit = () => {
    setOpen(true);
  }
  const returnSubmit = () => {
    setOpenReturn(true);
  }
  useEffect(() => {
    setData(Data.datalist)
    const allList = Data.datalist.map(
      (item) => {
        return { label: item.name, value: item.id, code: item.code }
      }
    )
    setDropDownList([...allList])
  }, []);

  // console.log(startDate, "startDate")
  // console.log(endtDate, "endtDate")

  let oneDayBack = moment(startDate).subtract(24, 'hours').toDate()
  let dateStart = new Date(moment(oneDayBack).format('DD/MMMM/YYYY'));
  let dateEnd = new Date(moment(endtDate).format('DD/MMMM/YYYY'));

  const days = (dateStart, dateEnd) => {
    let difference = dateEnd.getTime() - dateStart.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  }

  const bookingOk = () => {
    setOpen(false);
    const dataFound = Data?.datalist.find(element => element?.id === nameList?.id)
    if (days(dateStart, dateEnd) > 0 & dataFound?.price > 0 & days(dateStart, dateEnd) > dataFound?.minimum_rent_period & dataFound?.availability === true & dataFound?.needing_repair === false) {
      const dataMultiplication = dataFound?.price * days(dateStart, dateEnd)
      Swal.fire({
        title: `Your estimated price in $ ${dataMultiplication}`,
        text: 'Do you want to procedure?',
        type: "warning",
        icon: 'warning',
        footer: "",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ms-1'
        }
      }).then((result) => {
        if (result.isConfirmed === true) {
          toast.success("Successfully ", {
            position: toast.POSITION.TOP_RIGHT
          })
        } else { }
      })
    } else {
      // 
      if (days(dateStart, dateEnd) < 0) {
        toast.error("Please Enter Valid Data ", {
          position: toast.POSITION.TOP_RIGHT
        })
      }
      //
      if (days(dateStart, dateEnd) < dataFound?.minimum_rent_period) {
        toast.error("Book more than the minimum rent", {
          position: toast.POSITION.TOP_RIGHT
        })
      }
      // 
      if (dataFound?.needing_repair === true) {
        toast.error("This product is not repaired", {
          position: toast.POSITION.TOP_RIGHT
        })
      }
      // 
      if (dataFound?.availability === false) {
        toast.error("This product is not available", {
          position: toast.POSITION.TOP_RIGHT
        })
      }

    }

  }

  const returnOk = () => {
    setOpenReturn(false)
    const dataFound = Data?.datalist.find(element => element?.id === nameList?.id)
    if (dataFound?.type === "plain" & days(dateStart, dateEnd) > dataFound?.minimum_rent_period & dataFound?.availability === true & dataFound?.needing_repair === false ) {
      const durabilityResult = dataFound.durability - days(dateStart, dateEnd)
      const dataMultiplication = dataFound?.price * days(dateStart, dateEnd)
      Swal.fire({
        title: `Your total price is $ ${dataMultiplication}`,
        text: 'Do you want to procedure?',
        html: `Your durability ${durabilityResult} <br></br> Do you want to procedure.`,
        type: "warning",
        icon: 'warning',
        footer: "",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ms-1'
        }
      }).then((result) => {
        if (result.isConfirmed === true) {
          toast.success("Successfully ", {
            position: toast.POSITION.TOP_RIGHT
          })
        } else {

        }
      })
    } else {
       // 
      if (days(dateStart, dateEnd) < 0) {
        toast.error("Please Enter Valid Data ", {
          position: toast.POSITION.TOP_RIGHT
        })
      }
      //
      if (days(dateStart, dateEnd) < dataFound?.minimum_rent_period) {
        toast.error("Book more than the minimum rent", {
          position: toast.POSITION.TOP_RIGHT
        })
      }
      // 
      if (dataFound?.needing_repair === true) {
        toast.error("This product is not repaired", {
          position: toast.POSITION.TOP_RIGHT
        })
      }
      // 
      if (dataFound?.availability === false) {
        toast.error("This product is not available", {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    }
    if (dataFound?.type === "meter" & days(dateStart, dateEnd) > dataFound?.minimum_rent_period & dataFound?.availability === true & dataFound?.needing_repair === false) {
      // meterDate
      const durabilityResult = days(dateStart, dateEnd) * 2 + meterDate
      const totalDurabilityResult = dataFound.durability - durabilityResult
      const dataMultiplication = dataFound?.price * days(dateStart, dateEnd)
      Swal.fire({
        title: `Your total price is $ ${dataMultiplication}`,
        text: 'Do you want to procedure?',
        html: `Your durability ${totalDurabilityResult} <br></br> Do you want to procedure.`,
        type: "warning",
        icon: 'warning',
        footer: "",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ms-1'
        }
      }).then((result) => {
        if (result.isConfirmed === true) {
          toast.success("Successfully ", {
            position: toast.POSITION.TOP_RIGHT
          })
        } else {

        }
      })
    } else {
       // 
       if (days(dateStart, dateEnd) < 0) {
        toast.error("Please Enter Valid Data ", {
          position: toast.POSITION.TOP_RIGHT
        })
      }
      //
      if (days(dateStart, dateEnd) < dataFound?.minimum_rent_period) {
        toast.error("Book more than the minimum rent", {
          position: toast.POSITION.TOP_RIGHT
        })
      }
      // 
      if (dataFound?.needing_repair === true) {
        toast.error("This product is not repaired", {
          position: toast.POSITION.TOP_RIGHT
        })
      }
      // 
      if (dataFound?.availability === false) {
        toast.error("This product is not available", {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    }

  }

  const dataoooo = (e, value) => {
    e.preventDefault();
    setNameList({
      name: value?.label,
      id: value?.value,
      code: value?.code
    })
    const dataFound = Data?.datalist.find(element => element?.id === value?.value)
    if (dataFound.type === "meter") {
      setMeterInputFile(true)
    }

    // console.log(dataFound, "dataFound")
  }

  const mileageResultFunction = (event) => {
    const data = event.target.value / 10 * 2
    setMeterDate(data)
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = Data.datalist.filter((row) => {
      console.log(typeof (row.availability))
      return row.name.toLowerCase().includes(searchedVal?.toLowerCase()) || 
             row.code.toLowerCase().includes(searchedVal?.toLowerCase()) ||
             row.id.toLowerCase().includes(searchedVal?.toLowerCase()) ||
             row.price > parseInt(searchedVal) ||
             row.price === parseInt(searchedVal) ||
             row.durability === parseInt(searchedVal) ||
             row.availability.toString().toLowerCase().includes(searchedVal?.toLowerCase()) 
            //  row.price.includes(Number(searchedVal)) 
    });
    setData(filteredRows);
  };
  const classes = useStyles()
  return (
    <div className="table__area">
      <ToastContainer />
      <Box style={{padding: "15px"}} sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextField
                fullWidth
                id="standard-bare"
                variant="outlined"
                placeholder="How can we help"
                onChange={(searchVal) => requestSearch(searchVal.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchOutlined />
                    </IconButton>
                  ),
                }}
              />
      </Box>
      <DataTable
        fixedHeader
        fixedHeaderScrollHeight="500px"
        columns={columns}
        data={data}
        customStyles={customStyles}
      />
      <div className="table__btn_area">
        <button onClick={() => bookingSubmit()}> Book </button>
        <button onClick={() => returnSubmit()}> Return </button>
      </div>

      {/* <SearchBar onChange={(searchVal) => requestSearch(searchVal.target.value)} /> */}
      {/* BOOKING FROM  */}
      <Modal
        onClose={handleClose}
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className={classes.modalStyle1}>
          <Box sx={{ backgroundColor: "#ffff3" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", color: "#fff", background: "#db2164", padding: "0 15px", marginBottom: "15px", borderRadius: "4px" }}>
              <h3 className="add_money_trsfer_h_txt">  Book a Product  </h3>
            </Box>
          </Box>
          <Box sx={{ backgroundColor: "#ffff3" }}>
            <Autocomplete
              disablePortal
              style={{ width: "100%" }}
              id="combo-box-demo"
              key={dropDownList => dropDownList.value}
              options={dropDownList}
              sx={{ width: 300 }}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.value}>
                  {option.label}_{option.code}
                </Box>
              )}
              onChange={(e, valueTags) => {
                e.preventDefault();
                setNameList({
                  name: valueTags.label,
                  id: valueTags.value,
                  code: valueTags.code
                })
              }}
              renderInput={(params) => <TextField  {...params} label="Please Select " />}
            />
            <Row>
              <Col lg={6}>
                <div className="date_area">
                  <label> Start Date </label>
                  <Flatpickr
                    options={{
                      dateFormat: 'Y-m-d'
                    }}
                    style={{ marginTop: "15px", width: "100%" }}
                    placeholder="Start Date"
                    id="date-time-picker"
                    className="form-control"
                    onChange={date => {
                      setStartDate(date[0])
                    }}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="date_area">
                  <label> End Date </label>
                  <Flatpickr
                    options={{
                      dateFormat: 'Y-m-d'
                    }}
                    style={{ marginTop: "15px" }}
                    placeholder="End Date"
                    id="date-time-picker"
                    className="form-control"
                    onChange={date => {
                      setEndDate(date[0])
                    }}
                  />
                </div>
              </Col>
              <Col lg={12}>
                <div className="date_area" style={{ textAlign: "right" }}>
                  <Button onClick={() => bookingOk()} style={{ marginRight: "15px" }} variant="contained" color="success">
                    Yes
                  </Button>

                  <Button onClick={() => handleClose()} variant="contained" color="error">
                    No
                  </Button>
                </div>
              </Col>
            </Row>
          </Box>

        </Box>
      </Modal>

      {/* Return FROM  */}
      <Modal
        onClose={handleClose}
        open={openReturn}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className={classes.modalStyle1}>
          <Box sx={{ backgroundColor: "#ffff3" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", color: "#fff", background: "#db2164", padding: "0 15px", marginBottom: "15px", borderRadius: "4px" }}>
              <h3 className="add_money_trsfer_h_txt">  Return a Product  </h3>
            </Box>
          </Box>
          <Box component="form" sx={{ backgroundColor: "#ffff3" }}>
            <Autocomplete
              disablePortal
              style={{ width: "100%" }}
              id="combo-box-demo"
              key={dropDownList => dropDownList.value}
              options={dropDownList}
              sx={{ width: 300 }}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.value}>
                  {option.label}_{option.code}
                </Box>
              )}
              onChange={(e, value) => dataoooo(e, value)}
              renderInput={(params) => <TextField  {...params} label="Please Select " />}
            />
            <Row>
              <Col lg={6}>
                <div className="date_area">
                  <label> Start Date </label>
                  <Flatpickr
                    options={{
                      dateFormat: 'Y-m-d'
                    }}
                    style={{ marginTop: "15px", width: "100%" }}
                    placeholder="Start Date"
                    id="date-time-picker"
                    className="form-control"
                    onChange={date => {
                      setStartDate(date[0])
                    }}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="date_area">
                  <label> End Date </label>
                  <Flatpickr
                    options={{
                      dateFormat: 'Y-m-d'
                    }}
                    style={{ marginTop: "15px" }}
                    placeholder="End Date"
                    id="date-time-picker"
                    className="form-control"
                    onChange={date => {
                      setEndDate(date[0])
                    }}
                  />
                </div>
              </Col>

              {meterInputFile ? <>
                <Col lg={12}>
                  <div className="date_area">
                    <TextField
                      fullWidth
                      id="outlined-multiline-flexible"
                      label="Used Mileage"
                      onChange={mileageResultFunction}
                    />
                  </div>
                </Col>
              </> : <>  </>}

              <Col lg={12}>
                <div className="date_area" style={{ textAlign: "right" }}>
                  <Button onClick={() => returnOk()} style={{ marginRight: "15px" }} variant="contained" color="success">
                    Yes
                  </Button>
                  <Button onClick={() => handleClose()} variant="contained" color="error">
                    No
                  </Button>
                </div>
              </Col>
            </Row>
          </Box>

        </Box>
      </Modal>

    </div>
  );
}

export default App;
