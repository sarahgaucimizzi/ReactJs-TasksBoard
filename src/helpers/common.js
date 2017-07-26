export const showErrorNotification = (errorMessage) => {
  $.notify({
    // options
    icon: 'glyphicon glyphicon-warning-sign',
    title: 'ERROR',
    message: `Message received from server:  ${errorMessage}`,
  }, {
    // settings
    type: 'danger',
    allow_dismiss: true,
    newest_on_top: false,
    showProgressbar: false,
    placement: {
      from: 'bottom',
      align: 'right',
    },
    offset: 20,
    spacing: 10,
    z_index: 1051,
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp',
    },
  });
};

export const showWarningNotification = (errorMessage) => {
  $.notify({
    // options
    icon: 'glyphicon glyphicon-warning-sign',
    title: 'WARNING',
    message: errorMessage,
  }, {
    // settings
    type: 'warning',
    allow_dismiss: true,
    newest_on_top: false,
    showProgressbar: false,
    placement: {
      from: 'bottom',
      align: 'right',
    },
    offset: 20,
    spacing: 10,
    z_index: 1051,
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp',
    },
  });
};
