import { createContext, useContext } from 'react'

interface MatrixPauseContextType {
  isPaused: boolean
  setIsPaused: (paused: boolean) => void
}

export const MatrixPauseContext = createContext<MatrixPauseContextType>({
  isPaused: false,
  setIsPaused: () => {},
})

export function useMatrixPause() {
  return useContext(MatrixPauseContext)
}
