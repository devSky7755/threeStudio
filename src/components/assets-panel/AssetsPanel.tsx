import React, { Fragment } from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { GLTF as MOCK_GLTF } from "../../provider/mock";
import { OBJ as MOCK_OBJ } from "../../provider/mock";

interface DraggingProps {
  isDragging?: boolean;
}

const Item = styled.div<DraggingProps>`
  display: flex;
  user-select: none;
  padding: 0.5rem;
  margin: 0 0 0.5rem 0;
  align-items: flex-start;
  align-content: flex-start;
  line-height: 1.5;
  border-radius: 3px;
  background: #fff;
  border: 1px
    ${(props: any) => (props.isDragging ? "dashed #4099ff" : "solid #ddd")};
`;

const List = styled.div`
  border: 1px solid #ddd;
  padding: 0.5rem 0.5rem 0;
  border-radius: 3px;
  font-family: sans-serif;
`;

const Kiosk = styled(List)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const AssetsPanel = (props: any) => {
  const gltfs = MOCK_GLTF.files;
  const objs = MOCK_OBJ.files;
  const mergedFiles = [...gltfs, ...objs];

  return (
    <Droppable droppableId="ITEMS" isDropDisabled={true}>
      {(provided, snapshot) => (
        <Kiosk ref={provided.innerRef} {...provided.droppableProps}>
          {mergedFiles.map((item: any, index: number) => (
            <Draggable draggableId={item.id} index={index} key={item.id}>
              {(provided, snapshot) => (
                <Fragment>
                  <Item
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    isDragging={snapshot.isDragging}
                    style={provided.draggableProps.style}
                  >
                    {item.name}
                  </Item>
                  {snapshot.isDragging && (
                    <>
                      <Item>{item.name}</Item>
                    </>
                  )}
                </Fragment>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Kiosk>
      )}
    </Droppable>
  );
};

export default AssetsPanel;
