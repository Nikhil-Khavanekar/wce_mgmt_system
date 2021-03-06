import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import StoreMaterialForm from './StoreMaterial';
import OrderedMaterialForm from './OrderedMaterial';
import OrderedLabourForm from './LabourOrder';
import Notification from '../../helpers/components/Notification';
import axiosInstance from '../../helpers/axiosInstance';

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: 0,
  },
  acceptBtn: {
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      backgroundColor: '#006400',
    },
  },
  rejectBtn: {
    backgroundColor: 'red',
    color: 'white',
    '&:hover': {
      backgroundColor: '#CD0000',
    },
  },
  marginTop: {
    margin: theme.spacing(2, 0),
  },
}));

const submitHandler = () => {};

export default function FormB2({ complaintId, rejectHandler }) {
  const classes = useStyles();

  const [storeMaterials, setStoreMaterials] = useState([]);
  const [orderedMaterials, setOrderedMaterials] = useState([]);
  const [orderedLabours, setOrderedLabours] = useState([]);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await axiosInstance.get(
          `/api/complaint/getMaterial/${complaintId}`
        );
        const resultLabour = await axiosInstance.get(
          `/api/labour/${complaintId}`
        );
        const existing = result.data.availableInStore.map((doc) => {
          return {
            _id: doc.materialId._id,
            material: doc.materialId.material,
            materialSpec:doc.materialId.materialSpec,
            unitMeasure: doc.materialId.unitMeasure,
            cost: doc.materialId.cost,
            units: doc.quantity,
            addedBy: doc.addedBy,
          };
        });
        setStoreMaterials(existing);

        const orderExisting = result.data.orderedMaterial.map((doc) => {
          return{
          _id: doc._id,
          material: doc.material,
          approxCost: doc.approxCost,
          units: doc.quantity,
          addedBy: doc.addedBy,
          };
        });
        setOrderedMaterials(orderExisting);
        const labour = resultLabour.data.labourOrder.map((doc) => ({
         _id:     doc._id,
         lType:   doc.lType,
         lCharges: doc.lCharges,
         lCount:  doc.lCount,
         lAmount: doc.lAmount,
         addedBy: doc.addedBy,
        }));
        console.log(labour);
        setOrderedLabours(labour);
        
      } catch (error) {
        try {
          setMessage(error.response.data.error);
          setMessageType('error');
          setOpen(true);
        } catch (error) {
          
          setMessageType('error');
          setOpen(true);
        }
      }
    })();
  }, []);

  return (
    <Grid container spacing={4}>
      <Notification
        open={open}
        setOpen={setOpen}
        message={message}
        type={messageType}
      />
      {/*This grid item display the Available Material in the Store*/}
      <Grid item md={12}>
        <StoreMaterialForm
          complaintId={complaintId}
          materials={storeMaterials}
          setMaterials={setStoreMaterials}
        />
      </Grid>

      {/*This grid item display the Material to be ordered for the Store*/}
      <Grid item md={12}>
        <OrderedMaterialForm
          complaintId={complaintId}
          orderedMaterials={orderedMaterials}
          setOrderedMaterials={setOrderedMaterials}
        />
      </Grid>

      {/*This grid item display the Labour to be ordered*/}
      <Grid item md={12}>
        <OrderedLabourForm
          complaintId={complaintId}
          orderedLabours={orderedLabours}
          setOrderedLabours={setOrderedLabours}
        />
      </Grid>

      <Grid container className={classes.marginTop} spacing={1}>
        {/* <Grid item md={4} xs={8}>
          <Button
            className={[classes.button, classes.rejectBtn].join(' ')}
            size="large"
            variant="contained"
            onClick={rejectHandler}
          >
            Reject Request
          </Button>
        </Grid> */}
      </Grid>
    </Grid>
  );
}
