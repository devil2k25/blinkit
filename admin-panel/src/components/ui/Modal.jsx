import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const sizeMap = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
}

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={sizeMap[size] || 'sm'}
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pr: 1.5,
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        {title}
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        {children}
      </DialogContent>
    </Dialog>
  )
}
