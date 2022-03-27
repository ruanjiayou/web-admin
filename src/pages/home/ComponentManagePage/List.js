import React from 'react'
import { Observer } from 'mobx-react-lite'
import Item from './Item'
import EmptyView from '../../../component/EmptyView'
import LoadingView from '../../../component/LoadingView'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const getItemStyle = (isDragging, draggableStyle) => ({
  // change background colour if dragging
  background: isDragging ? "lightgreen" : "",
  padding: '15px',
  borderBottom: '1px solid #bbb',
  // styles we need to apply on draggables
  ...draggableStyle
});
const getListStyle = isDraggingOver => ({});
export default function List({ isLoading, items, ...restProps }) {
  const sort = restProps.sort
  return <div style={{ backgroundColor: '#eee', flex: 1, margin: '0 15%', height: '100%', overflow: 'auto' }}>
    <Observer>{() => {
      if (isLoading) {
        return <LoadingView />
      } else if (!items || items.length === 0) {
        return <EmptyView />
      } else {
        return <DragDropContext onDragEnd={async (result) => {
          if (!result.destination) {
            return;
          }
          console.log('start reorder')
          reorder(
            items,
            result.source.index,
            result.destination.index
          );
          console.log('start sort')
          await sort(result.source.index, result.destination.index)
          console.log('end')
        }}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <Item data={item} key={item.id} {...restProps} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      }
    }}</Observer>
  </div>
}