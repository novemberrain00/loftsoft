import { FC, ReactElement, ReactNode } from "react";

interface GridPropsI {
  children: ReactElement[]
  Row: ReactElement
  Cell: ReactElement
}
 
const Cell: FC<GridPropsI> = ({ children }) => {
  return <td>{children}</td>;
}

const Row: FC<GridPropsI> = ({ children }) => {
  return (
    <tr>
      {children.map((el) => {
        if (el.type === Cell) return el;
        
        return <td>{el}</td>;
      })}
    </tr>
  );
}
  
const  Grid: FC<GridPropsI> = ({ children }) => {
  return (
    <table>
      <tbody>
        {children.map((el: ReactElement) => {
          if (!el) return;

          if (el.type === Row) return el;

          if (el.type === Cell) {
            return <tr>{el}</tr>;
          }

          return (
            <tr>
              <td>{el}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
  
// Grid.Row = Row;
// Grid.Cell = Cell;
  
export default Grid;