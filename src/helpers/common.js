// Common helper methods
export const showErrorNotification = (errorMessage) => {
  $.notify({
    icon: 'glyphicon glyphicon-warning-sign',
    title: 'ERROR',
    message: `Message received from server:  ${errorMessage}`,
  }, {
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
    icon: 'glyphicon glyphicon-warning-sign',
    title: 'WARNING',
    message: errorMessage,
  }, {
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
