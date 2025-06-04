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
    const rowHeight = bounds.height / rows
    const colWidth = bounds.width / cols

    return (
      <>
        <SVGContainer>
          <rect
            width={bounds.width}
            height={bounds.height}
            fill="none"
            stroke="currentColor"
          />
          {Array.from({ length: rows - 1 }).map((_, i) => (
            <line
              key={`r${i}`}
              x1={0}
              x2={bounds.width}
              y1={(i + 1) * rowHeight}
              y2={(i + 1) * rowHeight}
              stroke="currentColor"
            />
          ))}
          {Array.from({ length: cols - 1 }).map((_, i) => (
            <line
              key={`c${i}`}
              y1={0}
              y2={bounds.height}
              x1={(i + 1) * colWidth}
              x2={(i + 1) * colWidth}
              stroke="currentColor"
            />
          ))}
        </SVGContainer>
        <Button
          type="icon"
          icon="minus"
          style={{
            position: 'absolute',
            top: -4,
            left: bounds.width,
            pointerEvents: 'auto',
            transform: 'scale(var(--tl-scale))',
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() =>
            editor.updateShape<TableShape>({
              id: shape.id,
              type: 'table',
              props: { cols: Math.max(1, cols - 1) },
            })
          }
        />
        <Button
          type="icon"
          icon="plus"
          style={{
            position: 'absolute',
            top: -4,
            left: bounds.width + 24,
            pointerEvents: 'auto',
            transform: 'scale(var(--tl-scale))',
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() =>
            editor.updateShape<TableShape>({
              id: shape.id,
              type: 'table',
              props: { cols: cols + 1 },
            })
          }
        />
        <Button
          type="icon"
          icon="minus"
          style={{
            position: 'absolute',
            top: bounds.height,
            left: -4,
            pointerEvents: 'auto',
            transform: 'scale(var(--tl-scale))',
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() =>
            editor.updateShape<TableShape>({
              id: shape.id,
              type: 'table',
              props: { rows: Math.max(1, rows - 1) },
            })
          }
        />
        <Button
          type="icon"
          icon="plus"
          style={{
            position: 'absolute',
            top: bounds.height + 24,
            left: -4,
            pointerEvents: 'auto',
            transform: 'scale(var(--tl-scale))',
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() =>
            editor.updateShape<TableShape>({
              id: shape.id,
              type: 'table',
              props: { rows: rows + 1 },
            })
          }
        />
      </>
    )
  }
}

