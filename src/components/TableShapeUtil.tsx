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

    const inputs = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        inputs.push(
          <input
            key={`${r}-${c}`}
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

    return (
      <>
        <SVGContainer>
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
        <div
          style={{
            position: 'absolute',
            top: -28,
            left: 0,
            display: 'flex',
            gap: 8,
            pointerEvents: 'auto',
            transform: 'scale(var(--tl-scale))',
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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
            <span style={{ fontSize: '12px' }}>{rows}</span>
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
            <span style={{ fontSize: '12px' }}>{cols}</span>
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
      </>
    )
  }
}

