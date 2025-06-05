/* eslint-disable react-hooks/rules-of-hooks */
import {
  Button,
  Geometry2d,
  Rectangle2d,
  ShapeUtil,
  SVGContainer,
  TLBaseShape,
  TLOnResizeHandler,
  resizeBox,
  toDomPrecision,
  useEditor,
} from '@tldraw/tldraw'
import { useState } from 'react'

export type TableShape = TLBaseShape<
  'table',
  {
    w: number
    h: number
    rows: number
    cols: number
  }
>

export class TableShapeUtil extends ShapeUtil<TableShape> {
  static type = 'table' as const

  override canEdit = () => true
  override isAspectRatioLocked = () => false

  getDefaultProps() {
    return {
      w: 300,
      h: 200,
      rows: 2,
      cols: 2,
    }
  }

  override getGeometry(shape: TableShape): Geometry2d {
    return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: false })
  }

  override onResize: TLOnResizeHandler<TableShape> = (shape, info) => {
    return resizeBox(shape, info)
  }

  indicator(shape: TableShape) {
    const bounds = this.editor.getShapeGeometry(shape).bounds
    return (
      <rect
        width={toDomPrecision(bounds.width)}
        height={toDomPrecision(bounds.height)}
        className="tl-frame-indicator"
      />
    )
  }

  override component(shape: TableShape) {
    const editor = useEditor()
    const bounds = this.editor.getShapeGeometry(shape).bounds
    const { rows, cols } = shape.props
    const [open, setOpen] = useState(false)

    const inputs = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        inputs.push(
          <input
            key={`${r}-${c}`}
            type="text"
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid currentColor',
              boxSizing: 'border-box',
            }}
          />
        )
      }
    }

    const gridLines = []
    for (let r = 1; r < rows; r++) {
      const y = (bounds.height * r) / rows
      gridLines.push(
        <line
          key={`row-${r}`}
          x1={0}
          y1={y}
          x2={bounds.width}
          y2={y}
          className="tl-frame__body"
          pointerEvents="none"
        />
      )
    }
    for (let c = 1; c < cols; c++) {
      const x = (bounds.width * c) / cols
      gridLines.push(
        <line
          key={`col-${c}`}
          x1={x}
          y1={0}
          x2={x}
          y2={bounds.height}
          className="tl-frame__body"
          pointerEvents="none"
        />
      )
    }

    return (
      <>
        <SVGContainer>
          <svg
            width={bounds.width}
            height={bounds.height}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <rect
              width={bounds.width}
              height={bounds.height}
              className="tl-frame__body"
              fill="none"
            />
            {gridLines}
          </svg>
          <foreignObject width={bounds.width} height={bounds.height}>
            <div
              style={{
                display: 'grid',
                width: '100%',
                height: '100%',
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
              }}
            >
              {inputs}
            </div>
          </foreignObject>
        </SVGContainer>
        <Button
          type="icon"
          icon="gear"
          style={{
            position: 'absolute',
            top: -32,
            left: 0,
            pointerEvents: 'auto',
            transform: 'scale(var(--tl-scale))',
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setOpen(!open)}
        />
        {open && (
          <div
            style={{
              position: 'absolute',
              top: -36,
              left: 28,
              background: 'var(--color-panel)',
              boxShadow: 'var(--shadow-2)',
              borderRadius: 4,
              padding: '6px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              pointerEvents: 'auto',
              transform: 'scale(var(--tl-scale))',
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '12px', flexGrow: 1 }}>Rows</span>
              <Button
                type="icon"
                icon="minus"
                onClick={() =>
                  editor.updateShape<TableShape>({
                    id: shape.id,
                    type: 'table',
                    props: { rows: Math.max(1, rows - 1) },
                  })
                }
              />
              <span style={{ fontSize: '12px', minWidth: '1.5em', textAlign: 'center' }}>{rows}</span>
              <Button
                type="icon"
                icon="plus"
                onClick={() =>
                  editor.updateShape<TableShape>({
                    id: shape.id,
                    type: 'table',
                    props: { rows: rows + 1 },
                  })
                }
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '12px', flexGrow: 1 }}>Columns</span>
              <Button
                type="icon"
                icon="minus"
                onClick={() =>
                  editor.updateShape<TableShape>({
                    id: shape.id,
                    type: 'table',
                    props: { cols: Math.max(1, cols - 1) },
                  })
                }
              />
              <span style={{ fontSize: '12px', minWidth: '1.5em', textAlign: 'center' }}>{cols}</span>
              <Button
                type="icon"
                icon="plus"
                onClick={() =>
                  editor.updateShape<TableShape>({
                    id: shape.id,
                    type: 'table',
                    props: { cols: cols + 1 },
                  })
                }
              />
            </div>
          </div>
        )}
      </>
    )
  }
}

