import { FrameShapeTool } from '@tldraw/tldraw'

export class TableTool extends FrameShapeTool {
  static override id = 'table'
  static override initial = 'idle'
  override shapeType = 'table'
}
