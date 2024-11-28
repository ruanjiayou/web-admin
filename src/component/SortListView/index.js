import React from 'react'
import { Observer } from 'mobx-react-lite'
import EmptyView from '../EmptyView'
import LoadingView from '../LoadingView'
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
  padding: 0,
  // styles we need to apply on draggables
  ...draggableStyle
});

export default function SortList({ isLoading, handler, items, droppableId, mode, direction = 'vertical', sort, listStyle = {}, itemStyle = {}, renderItem, ...restProps }) {
  return <Observer>{() => {
    if (isLoading) {
      return <LoadingView />
    } else if (!items || items.length === 0) {
      return mode === 'preview' ? null : <EmptyView />
    } else {
      return <DragDropContext isDragDisabled={mode === 'preview'} onDragStart={() => {

      }} onDragEnd={async (result) => {
        if (!result.destination) {
          return;
        }
        reorder(
          items,
          result.source.index,
          result.destination.index
        );
        await sort(result.source.index, result.destination.index)
      }}>
        <Droppable droppableId={droppableId} direction={direction} isDropDisabled={mode === 'preview'}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={listStyle}
            >
              {items.map((item, index) => (
                <Draggable key={item.id || item._id} draggableId={item.id || item._id} isDragDisabled={mode === 'preview'} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...(handler ? {} : provided.dragHandleProps)}
                      style={{
                        ...(getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )),
                        ...itemStyle
                      }}>
                      {handler && <div {...provided.dragHandleProps}>{handler}</div>}
                      {renderItem({ item, index, ...restProps })}
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
}