import UploadImage from "../Upload_Image/Upload_Image";
import React, { useState, useEffect, useContext } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  InputAdornment,
  IconButton
} from '@material-ui/core';

import { Visibility, VisibilityOff } from '@material-ui/icons';

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";
import useWhatsApps from "../../hooks/useWhatsApps";

const useStyles = makeStyles(theme => ({
  // ... estilos omitidos
}));

const UserSchema = Yup.object().shape({
  // ... validação omitida
});

const UserModal = ({ open, onClose, userId }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    email: "",
    password: "",
    profile: "user"
  };

  const { user: loggedInUser } = useContext(AuthContext);

  const [user, setUser] = useState(initialState);
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [whatsappId, setWhatsappId] = useState(false);
  const { loading, whatsApps } = useWhatsApps();
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    // ... código para buscar o usuário omitido
  }, [userId, open]);

  const handleClose = () => {
    onClose();
    setUser(initialState);
    setUserImage(null); // Limpa o estado da imagem
  };

  const handleSaveUser = async values => {
    const userData = { ...values, whatsappId, queueIds: selectedQueueIds, image: userImage };
    try {
      if (userId) {
        await api.put(`/users/${userId}`, userData);
      } else {
        await api.post("/users", userData);
      }
      toast.success(i18n.t("userModal.success"));
    } catch (err) {
      toastError(err);
    }
    handleClose();
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          {userId
            ? `${i18n.t("userModal.title.edit")}`
            : `${i18n.t("userModal.title.add")}`}
        </DialogTitle>
        <Formik
          initialValues={user}
          enableReinitialize={true}
          validationSchema={UserSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveUser({ ...values, image: userImage });
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                {/* Outros campos do formulário */}

                <UploadImage onImageUpload={(file) => setUserImage(file)} />
              </DialogContent>
              <DialogActions>
                {/* Botões de salvar e cancelar */}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default UserModal;