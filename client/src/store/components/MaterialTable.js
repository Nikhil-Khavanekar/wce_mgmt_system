import React, { useState } from 'react';
import {
  Grid,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  FormControl,
  TextField,
  Typography,
} from '@material-ui/core';
import { DeleteOutline, DoneOutline, Edit } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import axiosInstance from '../../helpers/axiosInstance';
import Confirmation from '../../helpers/components/Confirmation';
import PopOver from '../../helpers/components/PopOver';
import Notification from '../../helpers/components/Notification';
import MaterialFormValidator from '../utils/MaterialFormValidator';

const useStyles = makeStyles(() => ({
  numberInput: {
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
}));

export default function MaterialTable({ data, setData }) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [material, setMaterial] = useState('');
  const [materialSpec, setMaterialSpec] = useState('');
  const [unitMeasure, setUnitMeasure] = useState('');
  const [cost, setCost] = useState(0);
  const [units, setUnits] = useState(0);
  const [popoverEvent, setPopoverEvent] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [delIndex, setDelIndex] = useState(-1);
  const [errors, setErrors] = useState({});
  const [inEditMode, setInEditMode] = useState({
    state: false,
    row: null,
  });

  const resetPopoverStates = () => {
    setPopoverEvent(null);
    setPopoverVisible(false);
    setDelIndex(-1);
  };

  const showPopover = (event, index) => {
    setDelIndex(index);
    setPopoverEvent(event.target);
    setPopoverVisible(true);
  };

  function isMaterialExists(array, value) {
    const items = array.reduce(
      (acc, item, index) => (item.material === value ? [...acc, index] : acc),
      []
    );
    return items;
  }

  const checkDuplicate = (material, index) => {
    const allData = [...data];
    const duplicates = isMaterialExists(allData, material.trim());
    if (
      duplicates.length === 0 ||
      (duplicates.length === 1 && duplicates.includes(index))
    ) {
      setErrors({});
      return Promise.resolve({
        status: true,
        errors: errors,
      });
    } else {
      const error = {
        material: ['Material Exists'],
      };
      setErrors(error);
      return Promise.reject({
        status: false,
        errors: error,
      });
    }
  };

  const deleteHandler = async () => {
    try {
      console.log(data)
      await axiosInstance.delete(`/api/store/${data[delIndex]._id}`);

      setData(
        data.filter((item, i) => {
          return i !== delIndex;
        })
      );

      setMessage('Removed Material from Store');
      setMessageType('success');
      setOpen(true);
      
      resetPopoverStates();
    } catch (error) {
      try {
        setMessage(error.response.data.error);
        setMessageType('error');
        setOpen(true);
      } catch (error) {
        setMessage('Unable to delete material');
        setMessageType('error');
        setOpen(true);
      }
    }
  };

  const editHandler = (index, item) => {
    setMaterial(item.material);
    setMaterialSpec(item.materialSpec);
    setUnitMeasure(item.unitMeasure);
    setCost(item.cost);
    setUnits(item.units);
    setInEditMode({
      state: true,
      row: index,
    });
  };

  const saveHandler = (index) => {
    MaterialFormValidator()
      .validate({
        material,
        materialSpec,
        unitMeasure,
        cost,
        units,
      })
      .then(
        () => {
          checkDuplicate(material, index).then(
            async () => {
              try {
                const result = await axiosInstance.put(
                  `/api/store/${data[index]._id}`,
                  { material: material.trim(), materialSpec: materialSpec.trim(), unitMeasure: unitMeasure.trim(), cost:cost, quantity: units }
                );
                if (!result.data.success) throw new Error();

                setInEditMode({
                  state: false,
                  row: null,
                });

                const updatedMaterial = result.data.data;

                const editedData = [...data];
                editedData[index] = {
                  material: updatedMaterial.material,
                  materialSpec: updatedMaterial.materialSpec,
                  unitMeasure: updatedMaterial.unitMeasure,
                  cost: updatedMaterial.cost,
                  units: updatedMaterial.quantity,
                  _id: updatedMaterial._id,
                };
                setData(editedData);

                setMessage('Material Details Updated');
                setMessageType('success');
                setOpen(true);
              } catch (error) {
                try {
                  setMessage(error.response.data.error);
                  setMessageType('error');
                  setOpen(true);
                } catch (error) {
                  setMessage('Unable to update material');
                  setMessageType('error');
                  setOpen(true);
                }
              }
            },
            (error) => {
              setErrors(error.errors);
            }
          );
        },
        (error) => {
          setErrors(error.errors);
        }
      );
  };

  const popoverContent = (
    <Confirmation
      confirmText={'Are you sure?'}
      onResolve={deleteHandler}
      onReject={resetPopoverStates}
    />
  );

  const editModeForm = (index) => {
    return (
      <TableRow key={index}>
        <TableCell component="th" scope="row" width="40%">
          <FormControl>
            <TextField
              fullWidth
              required
              autoFocus
              inputProps={{ 'data-testid': 'material' }}
              label="Material"
              size="small"
              value={material}
              onChange={(event) => setMaterial(event.target.value)}
              error={!!errors.material}
              helperText={errors.material ? errors.material[0] : ' '}
            />
          </FormControl>
        </TableCell>

        <TableCell component="th" scope="row" width="40%">
          <FormControl>
            <TextField
              fullWidth
              required
              autoFocus
              inputProps={{ 'data-testid': 'materialSpec' }}
              label="MaterialSpec"
              size="small"
              value={materialSpec}
              onChange={(event) => setMaterialSpec(event.target.value)}
              error={!!errors.materialSpec}
              helperText={errors.materialSpec ? errors.materialSpec[0] : ' '}
            />
          </FormControl>
        </TableCell>

        <TableCell component="th" scope="row" width="40%">
          <FormControl>
            <TextField
              fullWidth
              required
              autoFocus
              inputProps={{ 'data-testid': 'unitMeasure' }}
              label="unitMeasure"
              size="small"
              value={unitMeasure}
              onChange={(event) => setUnitMeasure(event.target.value)}
              error={!!errors.unitMeasure}
              helperText={errors.unitMeasure ? errors.unitMeasure[0] : ' '}
            />
          </FormControl>
        </TableCell>

        <TableCell component="th" scope="row" align="right" width="20%">
          <FormControl>
            <TextField
              className={classes.numberInput}
              inputProps={{
                'data-testid': 'cost',
                style: { textAlign: 'right' },
              }}
              InputLabelProps={{ shrink: true }}
              type="number"
              fullWidth
              required
              autoFocus
              label="Cost"
              size="small"
              value={cost}
              onChange={(event) => setCost(event.target.value)}
              error={!!errors.cost}
              helperText={errors.cost ? errors.cost[0] : ' '}
            />
          </FormControl>
        </TableCell>


        <TableCell component="th" scope="row" align="right" width="20%">
          <FormControl>
            <TextField
              className={classes.numberInput}
              inputProps={{
                'data-testid': 'units',
                style: { textAlign: 'right' },
              }}
              InputLabelProps={{ shrink: true }}
              type="number"
              fullWidth
              required
              autoFocus
              label="Units"
              size="small"
              value={units}
              onChange={(event) => setUnits(event.target.value)}
              error={!!errors.units}
              helperText={errors.units ? errors.units[0] : ' '}
            />
          </FormControl>
        </TableCell>
        <TableCell component="th" scope="row" align="center" width="20%">
          <IconButton onClick={() => saveHandler(index)}>
            <DoneOutline style={{ color: 'black' }} fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  function displayInfo(index, item) {
    return (
      <TableRow key={index}>
        <TableCell component="th" scope="row" width="20%">
          {item.material}
        </TableCell>
        <TableCell component="th" scope="row" width="20%">
          {item.materialSpec}
        </TableCell>
        <TableCell component="th" scope="row" width="20%">
          {item.unitMeasure}
        </TableCell>
        <TableCell component="th" scope="row" align="right" width="20%">
          {item.cost}
        </TableCell>
        <TableCell component="th" scope="row" align="right" width="20%">
          {item.units}
        </TableCell>
        <TableCell component="th" scope="row" width="20%" align="center">
          <IconButton
            style={{ padding: '5px' }}
            size="small"
            disabled={inEditMode.state}
            onClick={(event) => editHandler(index, item)}
          >
            <Edit style={{ color: 'black' }} fontSize="small" />
          </IconButton>
          <IconButton
            style={{ padding: '5px' }}
            size="small"
            onClick={(event) => showPopover(event, index)}
          >
            <DeleteOutline style={{ color: 'red' }} fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <React.Fragment>
      <Notification open={open} setOpen={setOpen} message={message} type={messageType} />
      <Grid>
        <Typography variant="h4">Current Available Material</Typography>
      </Grid>
      <TableContainer component={Paper}>
        {popoverVisible ? (
          <PopOver event={popoverEvent} content={popoverContent} />
        ) : null}
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width="20%">Material</TableCell>
              <TableCell width="20%">Material Specification</TableCell>
              <TableCell width="20%">Unit of Measurement</TableCell>
              <TableCell
                width="20%"
                align={inEditMode.state ? 'left' : 'right'}
              >
               Unit Cost
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                align={inEditMode.state ? 'left' : 'right'}
                width="20%"
              >
                Units
              </TableCell>
              <TableCell width="20%" align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <React.Fragment key={index}>
                {inEditMode.state && inEditMode.row === index
                  ? editModeForm(index)
                  : displayInfo(index, item)}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
