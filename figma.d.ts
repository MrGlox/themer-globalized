// Figma Plugin API version 1, update 14

declare global {
  // Global variable with Figma's plugin API.
  const figma: PluginAPI
  const __html__: string
  const __uiFiles__: {
    [key: string]: string
  }

  interface PluginAPI {
    readonly apiVersion: "1.0.0"
    readonly command: string

    readonly fileKey: string | undefined

    readonly viewport: ViewportAPI
    closePlugin(message?: string): void

    notify(message: string, options?: NotificationOptions): NotificationHandler

    showUI(html: string, options?: ShowUIOptions): void
    readonly ui: UIAPI

    readonly clientStorage: ClientStorageAPI

    getNodeById(id: string): BaseNode | null
    getStyleById(id: string): BaseStyle | null

    readonly root: DocumentNode
    currentPage: PageNode

    on(type: "selectionchange" | "currentpagechange" | "close", callback: () => void): void
    once(type: "selectionchange" | "currentpagechange" | "close", callback: () => void): void
    off(type: "selectionchange" | "currentpagechange" | "close", callback: () => void): void

    readonly mixed: unique symbol

    createRectangle(): RectangleNode
    createLine(): LineNode
    createEllipse(): EllipseNode
    createPolygon(): PolygonNode
    createStar(): StarNode
    createVector(): VectorNode
    createText(): TextNode
    createFrame(): FrameNode
    createComponent(): ComponentNode
    createPage(): PageNode
    createSlice(): SliceNode
    /**
     * [DEPRECATED]: This API often fails to create a valid boolean operation. Use figma.union, figma.subtract, figma.intersect and figma.exclude instead.
     */
    createBooleanOperation(): BooleanOperationNode

    createPaintStyle(): PaintStyle
    createTextStyle(): TextStyle
    createEffectStyle(): EffectStyle
    createGridStyle(): GridStyle

    // The styles are returned in the same order as displayed in the UI. Only
    // local styles are returned. Never styles from team library.
    getLocalPaintStyles(): PaintStyle[]
    getLocalTextStyles(): TextStyle[]
    getLocalEffectStyles(): EffectStyle[]
    getLocalGridStyles(): GridStyle[]

    moveLocalPaintStyleAfter(targetNode: PaintStyle, reference: PaintStyle | null): void
    moveLocalTextStyleAfter(targetNode: TextStyle, reference: TextStyle | null): void
    moveLocalEffectStyleAfter(targetNode: EffectStyle, reference: EffectStyle | null): void
    moveLocalGridStyleAfter(targetNode: GridStyle, reference: GridStyle | null): void

    moveLocalPaintFolderAfter(targetFolder: string, reference: string | null): void
    moveLocalTextFolderAfter(targetFolder: string, reference: string | null): void
    moveLocalEffectFolderAfter(targetFolder: string, reference: string | null): void
    moveLocalGridFolderAfter(targetFolder: string, reference: string | null): void

    importComponentByKeyAsync(key: string): Promise<ComponentNode>
    importComponentSetByKeyAsync(key: string): Promise<ComponentSetNode>
    importStyleByKeyAsync(key: string): Promise<BaseStyle>

    listAvailableFontsAsync(): Promise<Font[]>
    loadFontAsync(fontName: FontName): Promise<void>
    readonly hasMissingFont: boolean

    createNodeFromSvg(svg: string): FrameNode

    createImage(data: Uint8Array): Image
    getImageByHash(hash: string): Image

    combineAsVariants(nodes: ReadonlyArray<ComponentNode>, parent: BaseNode & ChildrenMixin, index?: number): ComponentSetNode
    group(nodes: ReadonlyArray<BaseNode>, parent: BaseNode & ChildrenMixin, index?: number): GroupNode
    flatten(nodes: ReadonlyArray<BaseNode>, parent?: BaseNode & ChildrenMixin, index?: number): VectorNode

    union(nodes: ReadonlyArray<BaseNode>, parent: BaseNode & ChildrenMixin, index?: number): BooleanOperationNode
    subtract(nodes: ReadonlyArray<BaseNode>, parent: BaseNode & ChildrenMixin, index?: number): BooleanOperationNode
    intersect(nodes: ReadonlyArray<BaseNode>, parent: BaseNode & ChildrenMixin, index?: number): BooleanOperationNode
    exclude(nodes: ReadonlyArray<BaseNode>, parent: BaseNode & ChildrenMixin, index?: number): BooleanOperationNode
  }

  interface ClientStorageAPI {
    getAsync(key: string): Promise<any | undefined>
    setAsync(key: string, value: any): Promise<void>
  }

  interface NotificationOptions {
    timeout?: number
  }

  interface NotificationHandler {
    cancel: () => void
  }

  interface ShowUIOptions {
    visible?: boolean
    width?: number
    height?: number
  }

  interface UIPostMessageOptions {
    origin?: string
  }

  interface OnMessageProperties {
    origin: string
  }

  type MessageEventHandler = (pluginMessage: any, props: OnMessageProperties) => void

  interface UIAPI {
    show(): void
    hide(): void
    resize(width: number, height: number): void
    close(): void

    postMessage(pluginMessage: any, options?: UIPostMessageOptions): void
    onmessage: MessageEventHandler | undefined
    on(type: "message", callback: MessageEventHandler): void
    once(type: "message", callback: MessageEventHandler): void
    off(type: "message", callback: MessageEventHandler): void
  }

  interface ViewportAPI {
    center: Vector
    zoom: number
    scrollAndZoomIntoView(nodes: ReadonlyArray<BaseNode>): void
    readonly bounds: Rect
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Datatypes

  type Transform = [
    [number, number, number],
    [number, number, number]
  ]

  interface Vector {
    readonly x: number
    readonly y: number
  }

  interface Rect {
    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number
  }

  interface RGB {
    readonly r: number
    readonly g: number
    readonly b: number
  }

  interface RGBA {
    readonly r: number
    readonly g: number
    readonly b: number
    readonly a: number
  }

  interface FontName {
    readonly family: string
    readonly style: string
  }

  type TextCase = "ORIGINAL" | "UPPER" | "LOWER" | "TITLE"

  type TextDecoration = "NONE" | "UNDERLINE" | "STRIKETHROUGH"

  interface ArcData {
    readonly startingAngle: number
    readonly endingAngle: number
    readonly innerRadius: number
  }

  interface ShadowEffect {
    readonly type: "DROP_SHADOW" | "INNER_SHADOW"
    readonly color: RGBA
    readonly offset: Vector
    readonly radius: number
    readonly spread?: number
    readonly visible: boolean
    readonly blendMode: BlendMode
  }

  interface BlurEffect {
    readonly type: "LAYER_BLUR" | "BACKGROUND_BLUR"
    readonly radius: number
    readonly visible: boolean
  }

  type Effect = ShadowEffect | BlurEffect

  type ConstraintType = "MIN" | "CENTER" | "MAX" | "STRETCH" | "SCALE"

  interface Constraints {
    readonly horizontal: ConstraintType
    readonly vertical: ConstraintType
  }

  interface ColorStop {
    readonly position: number
    readonly color: RGBA
  }

  interface ImageFilters {
    readonly exposure?: number
    readonly contrast?: number
    readonly saturation?: number
    readonly temperature?: number
    readonly tint?: number
    readonly highlights?: number
    readonly shadows?: number
  }

  interface SolidPaint {
    readonly type: "SOLID"
    readonly color: RGB

    readonly visible?: boolean
    readonly opacity?: number
    readonly blendMode?: BlendMode
  }

  interface GradientPaint {
    readonly type: "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND"
    readonly gradientTransform: Transform
    readonly gradientStops: ReadonlyArray<ColorStop>

    readonly visible?: boolean
    readonly opacity?: number
    readonly blendMode?: BlendMode
  }

  interface ImagePaint {
    readonly type: "IMAGE"
    readonly scaleMode: "FILL" | "FIT" | "CROP" | "TILE"
    readonly imageHash: string | null
    readonly imageTransform?: Transform // setting for "CROP"
    readonly scalingFactor?: number // setting for "TILE"
    readonly rotation?: number // setting for "FILL" | "FIT" | "TILE"
    readonly filters?: ImageFilters

    readonly visible?: boolean
    readonly opacity?: number
    readonly blendMode?: BlendMode
  }

  type Paint = SolidPaint | GradientPaint | ImagePaint

  interface Guide {
    readonly axis: "X" | "Y"
    readonly offset: number
  }

  interface RowsColsLayoutGrid {
    readonly pattern: "ROWS" | "COLUMNS"
    readonly alignment: "MIN" | "MAX" | "STRETCH" | "CENTER"
    readonly gutterSize: number

    readonly count: number        // Infinity when "Auto" is set in the UI
    readonly sectionSize?: number // Not set for alignment: "STRETCH"
    readonly offset?: number      // Not set for alignment: "CENTER"

    readonly visible?: boolean
    readonly color?: RGBA
  }

  interface GridLayoutGrid {
    readonly pattern: "GRID"
    readonly sectionSize: number

    readonly visible?: boolean
    readonly color?: RGBA
  }

  type LayoutGrid = RowsColsLayoutGrid | GridLayoutGrid

  interface ExportSettingsConstraints {
    readonly type: "SCALE" | "WIDTH" | "HEIGHT"
    readonly value: number
  }

  interface ExportSettingsImage {
    readonly format: "JPG" | "PNG"
    readonly contentsOnly?: boolean    // defaults to true
    readonly suffix?: string
    readonly constraint?: ExportSettingsConstraints
  }

  interface ExportSettingsSVG {
    readonly format: "SVG"
    readonly contentsOnly?: boolean    // defaults to true
    readonly suffix?: string
    readonly svgOutlineText?: boolean  // defaults to true
    readonly svgIdAttribute?: boolean  // defaults to false
    readonly svgSimplifyStroke?: boolean // defaults to true
  }

  interface ExportSettingsPDF {
    readonly format: "PDF"
    readonly contentsOnly?: boolean    // defaults to true
    readonly suffix?: string
  }

  type ExportSettings = ExportSettingsImage | ExportSettingsSVG | ExportSettingsPDF

  type WindingRule = "NONZERO" | "EVENODD"

  interface VectorVertex {
    readonly x: number
    readonly y: number
    readonly strokeCap?: StrokeCap
    readonly strokeJoin?: StrokeJoin
    readonly cornerRadius?: number
    readonly handleMirroring?: HandleMirroring
  }

  interface VectorSegment {
    readonly start: number
    readonly end: number
    readonly tangentStart?: Vector  // Defaults to { x: 0, y: 0 }
    readonly tangentEnd?: Vector  // Defaults to { x: 0, y: 0 }
  }

  interface VectorRegion {
    readonly windingRule: WindingRule
    readonly loops: ReadonlyArray<ReadonlyArray<number>>
  }

  interface VectorNetwork {
    readonly vertices: ReadonlyArray<VectorVertex>
    readonly segments: ReadonlyArray<VectorSegment>
    readonly regions?: ReadonlyArray<VectorRegion> // Defaults to []
  }

  interface VectorPath {
    readonly windingRule: WindingRule | "NONE"
    readonly data: string
  }

  type VectorPaths = ReadonlyArray<VectorPath>

  interface LetterSpacing {
    readonly value: number
    readonly unit: "PIXELS" | "PERCENT"
  }

  type LineHeight = {
    readonly value: number
    readonly unit: "PIXELS" | "PERCENT"
  } | {
    readonly unit: "AUTO"
  }

  type HyperlinkTarget = {
    type: "URL" | "NODE"
    value: string
  }

  type BlendMode =
    "NORMAL" |
    "DARKEN" |
    "MULTIPLY" |
    "LINEAR_BURN" |
    "COLOR_BURN" |
    "LIGHTEN" |
    "SCREEN" |
    "LINEAR_DODGE" |
    "COLOR_DODGE" |
    "OVERLAY" |
    "SOFT_LIGHT" |
    "HARD_LIGHT" |
    "DIFFERENCE" |
    "EXCLUSION" |
    "HUE" |
    "SATURATION" |
    "COLOR" |
    "LUMINOSITY"

  interface Font {
    fontName: FontName
  }

  type Reaction = { action: Action, trigger: Trigger }

  type Action =
    { readonly type: "BACK" | "CLOSE" } |
    { readonly type: "URL", url: string } |
    { readonly type: "NODE"
      readonly destinationId: string | null
      readonly navigation: Navigation
      readonly transition: Transition | null
      readonly preserveScrollPosition: boolean

      // Only present if navigation == "OVERLAY" and the destination uses
      // overlay position type "RELATIVE"
      readonly overlayRelativePosition?: Vector
    }

  interface SimpleTransition {
    readonly type: "DISSOLVE" | "SMART_ANIMATE" | "SCROLL_ANIMATE"
    readonly easing: Easing
    readonly duration: number
  }

  interface DirectionalTransition {
    readonly type: "MOVE_IN" | "MOVE_OUT" | "PUSH" | "SLIDE_IN" | "SLIDE_OUT"
    readonly direction: "LEFT" | "RIGHT" | "TOP" | "BOTTOM"
    readonly matchLayers: boolean

    readonly easing: Easing
    readonly duration: number
  }

  type Transition = SimpleTransition | DirectionalTransition

  type Trigger =
    | { readonly type: "ON_CLICK" | "ON_HOVER" | "ON_PRESS" | "ON_DRAG" }
    | {
        readonly type: "AFTER_TIMEOUT";
        readonly timeout: number;
      }
    | {
        readonly type:
          | "MOUSE_ENTER"
          | "MOUSE_LEAVE"
          | "MOUSE_UP"
          | "MOUSE_DOWN";
        readonly delay: number;
      }
    | {
        readonly type: "ON_KEY_DOWN";
        readonly device:
          | "KEYBOARD"
          | "XBOX_ONE"
          | "PS4"
          | "SWITCH_PRO"
          | "UNKNOWN_CONTROLLER";
        readonly keyCodes: ReadonlyArray<number>;
      };

  type Navigation = "NAVIGATE" | "SWAP" | "OVERLAY" | "SCROLL_TO" | "CHANGE_TO"

  interface Easing {
    readonly type: "EASE_IN" | "EASE_OUT" | "EASE_IN_AND_OUT" | "LINEAR"
    readonly easingFunctionCubicBezier?: EasingFunctionBezier
  }

  interface EasingFunctionBezier {
    x1: number,
    y1: number,
    x2: number,
    y2: number
  }

  type OverflowDirection = "NONE" | "HORIZONTAL" | "VERTICAL" | "BOTH"

  type OverlayPositionType = "CENTER" | "TOP_LEFT" | "TOP_CENTER" | "TOP_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_CENTER" | "BOTTOM_RIGHT" | "MANUAL"

  type OverlayBackground =
    { readonly type: "NONE" } |
    { readonly type: "SOLID_COLOR", readonly color: RGBA }

  type OverlayBackgroundInteraction = "NONE" | "CLOSE_ON_CLICK_OUTSIDE"

  type PublishStatus = "UNPUBLISHED" | "CURRENT" | "CHANGED"

  ////////////////////////////////////////////////////////////////////////////////
  // Mixins

  interface BaseNodeMixin {
    readonly id: string
    readonly parent: (BaseNode & ChildrenMixin) | null
    name: string // Note: setting this also sets `autoRename` to false on TextNodes
    readonly removed: boolean
    toString(): string
    remove(): void

    getPluginData(key: string): string
    setPluginData(key: string, value: string): void

    // Namespace is a string that must be at least 3 alphanumeric characters, and should
    // be a name related to your plugin. Other plugins will be able to read this data.
    getSharedPluginData(namespace: string, key: string): string
    setSharedPluginData(namespace: string, key: string, value: string): void
    setRelaunchData(data: { [command: string]: /* description */ string }): void
  }

  interface SceneNodeMixin {
    visible: boolean
    locked: boolean
  }

  interface ChildrenMixin {
    readonly children: ReadonlyArray<SceneNode>

    appendChild(child: SceneNode): void
    insertChild(index: number, child: SceneNode): void

    findChildren(callback?: (node: SceneNode) => boolean): SceneNode[]
    findChild(callback: (node: SceneNode) => boolean): SceneNode | null

    /**
     * If you only need to search immediate children, it is much faster
     * to call node.children.filter(callback) or node.findChildren(callback)
     */
    findAll(callback?: (node: SceneNode) => boolean): SceneNode[]

    /**
     * If you only need to search immediate children, it is much faster
     * to call node.children.find(callback) or node.findChild(callback)
     */
    findOne(callback: (node: SceneNode) => boolean): SceneNode | null
  }

  interface ConstraintMixin {
    constraints: Constraints
  }

  interface LayoutMixin {
    readonly absoluteTransform: Transform
    relativeTransform: Transform
    x: number
    y: number
    rotation: number // In degrees

    readonly width: number
    readonly height: number
    constrainProportions: boolean

    layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH" | "INHERIT" // applicable only inside auto-layout frames
    layoutGrow: number

    resize(width: number, height: number): void
    resizeWithoutConstraints(width: number, height: number): void
    rescale(scale: number): void
  }

  interface BlendMixin {
    opacity: number
    blendMode: "PASS_THROUGH" | BlendMode
    isMask: boolean
    effects: ReadonlyArray<Effect>
    effectStyleId: string
  }

  interface ContainerMixin {
    expanded: boolean
    backgrounds: ReadonlyArray<Paint> // DEPRECATED: use 'fills' instead
    backgroundStyleId: string // DEPRECATED: use 'fillStyleId' instead
  }

  type StrokeCap = "NONE" | "ROUND" | "SQUARE" | "ARROW_LINES" | "ARROW_EQUILATERAL"
  type StrokeJoin = "MITER" | "BEVEL" | "ROUND"
  type HandleMirroring = "NONE" | "ANGLE" | "ANGLE_AND_LENGTH"

  interface GeometryMixin {
    fills: ReadonlyArray<Paint> | PluginAPI['mixed']
    strokes: ReadonlyArray<Paint>
    strokeWeight: number
    strokeMiterLimit: number
    strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE"
    strokeCap: StrokeCap | PluginAPI['mixed']
    strokeJoin: StrokeJoin | PluginAPI['mixed']
    dashPattern: ReadonlyArray<number>
    fillStyleId: string | PluginAPI['mixed']
    strokeStyleId: string
    outlineStroke(): VectorNode | null
  }

  interface CornerMixin {
    cornerRadius: number | PluginAPI['mixed']
    cornerSmoothing: number
  }

  interface RectangleCornerMixin {
    topLeftRadius: number
    topRightRadius: number
    bottomLeftRadius: number
    bottomRightRadius: number
  }

  interface ExportMixin {
    exportSettings: ReadonlyArray<ExportSettings>
    exportAsync(settings?: ExportSettings): Promise<Uint8Array> // Defaults to PNG format
  }

  interface FramePrototypingMixin {
    overflowDirection: OverflowDirection
    numberOfFixedChildren: number

    readonly overlayPositionType: OverlayPositionType
    readonly overlayBackground: OverlayBackground
    readonly overlayBackgroundInteraction: OverlayBackgroundInteraction
  }

  interface ReactionMixin {
    readonly reactions: ReadonlyArray<Reaction>
  }

  interface DocumentationLink {
    readonly uri: string
  }

  interface PublishableMixin {
    description: string
    documentationLinks: ReadonlyArray<DocumentationLink>
    readonly remote: boolean
    readonly key: string // The key to use with "importComponentByKeyAsync", "importComponentSetByKeyAsync", and "importStyleByKeyAsync"
    getPublishStatusAsync(): Promise<PublishStatus>
  }

  interface DefaultShapeMixin extends
    BaseNodeMixin, SceneNodeMixin, ReactionMixin,
    BlendMixin, GeometryMixin, LayoutMixin,
    ExportMixin {
  }

  interface BaseFrameMixin extends
    BaseNodeMixin, SceneNodeMixin, ChildrenMixin,
    ContainerMixin, GeometryMixin, CornerMixin,
    RectangleCornerMixin, BlendMixin, ConstraintMixin,
    LayoutMixin, ExportMixin {

    layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL"
    primaryAxisSizingMode: "FIXED" | "AUTO" // applicable only if layoutMode != "NONE"
    counterAxisSizingMode: "FIXED" | "AUTO" // applicable only if layoutMode != "NONE"

    primaryAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN" // applicable only if layoutMode != "NONE"
    counterAxisAlignItems: "MIN" | "MAX" | "CENTER" // applicable only if layoutMode != "NONE"


    paddingLeft: number // applicable only if layoutMode != "NONE"
    paddingRight: number // applicable only if layoutMode != "NONE"
    paddingTop: number // applicable only if layoutMode != "NONE"
    paddingBottom: number // applicable only if layoutMode != "NONE"
    itemSpacing: number // applicable only if layoutMode != "NONE"

    horizontalPadding: number // DEPRECATED: use the individual paddings
    verticalPadding: number // DEPRECATED: use the individual paddings

    layoutGrids: ReadonlyArray<LayoutGrid>
    gridStyleId: string
    clipsContent: boolean
    guides: ReadonlyArray<Guide>
  }

  interface DefaultFrameMixin extends
    BaseFrameMixin,
    FramePrototypingMixin,
    ReactionMixin {}

  ////////////////////////////////////////////////////////////////////////////////
  // Nodes

  interface DocumentNode extends BaseNodeMixin {
    readonly type: "DOCUMENT"

    readonly children: ReadonlyArray<PageNode>

    appendChild(child: PageNode): void
    insertChild(index: number, child: PageNode): void
    findChildren(callback?: (node: PageNode) => boolean): Array<PageNode>
    findChild(callback: (node: PageNode) => boolean): PageNode | null

    /**
     * If you only need to search immediate children, it is much faster
     * to call node.children.filter(callback) or node.findChildren(callback)
     */
    findAll(callback?: (node: PageNode | SceneNode) => boolean): Array<PageNode | SceneNode>

    /**
     * If you only need to search immediate children, it is much faster
     * to call node.children.find(callback) or node.findChild(callback)
     */
    findOne(callback: (node: PageNode | SceneNode) => boolean): PageNode | SceneNode | null
  }

  interface PageNode extends BaseNodeMixin, ChildrenMixin, ExportMixin {

    readonly type: "PAGE"
    clone(): PageNode

    guides: ReadonlyArray<Guide>
    selection: ReadonlyArray<SceneNode>
    selectedTextRange: { node: TextNode, start: number, end: number } | null

    backgrounds: ReadonlyArray<Paint>

    readonly prototypeStartNode: FrameNode | GroupNode | ComponentNode | InstanceNode | null
  }

  interface FrameNode extends DefaultFrameMixin {
    readonly type: "FRAME"
    clone(): FrameNode
  }

  interface GroupNode extends
    BaseNodeMixin, SceneNodeMixin, ReactionMixin,
    ChildrenMixin, ContainerMixin, BlendMixin,
    LayoutMixin, ExportMixin {

    readonly type: "GROUP"
    clone(): GroupNode
  }

  interface SliceNode extends
    BaseNodeMixin, SceneNodeMixin, LayoutMixin,
    ExportMixin {

    readonly type: "SLICE"
    clone(): SliceNode
  }

  interface RectangleNode extends DefaultShapeMixin, ConstraintMixin, CornerMixin, RectangleCornerMixin {
    readonly type: "RECTANGLE"
    clone(): RectangleNode
  }

  interface LineNode extends DefaultShapeMixin, ConstraintMixin {
    readonly type: "LINE"
    clone(): LineNode
  }

  interface EllipseNode extends DefaultShapeMixin, ConstraintMixin, CornerMixin {
    readonly type: "ELLIPSE"
    clone(): EllipseNode
    arcData: ArcData
  }

  interface PolygonNode extends DefaultShapeMixin, ConstraintMixin, CornerMixin {
    readonly type: "POLYGON"
    clone(): PolygonNode
    pointCount: number
  }

  interface StarNode extends DefaultShapeMixin, ConstraintMixin, CornerMixin {
    readonly type: "STAR"
    clone(): StarNode
    pointCount: number
    innerRadius: number
  }

  interface VectorNode extends DefaultShapeMixin, ConstraintMixin, CornerMixin {
    readonly type: "VECTOR"
    clone(): VectorNode
    vectorNetwork: VectorNetwork
    vectorPaths: VectorPaths
    handleMirroring: HandleMirroring | PluginAPI['mixed']
  }

  interface TextNode extends DefaultShapeMixin, ConstraintMixin {
    readonly type: "TEXT"
    clone(): TextNode
    readonly hasMissingFont: boolean
    textAlignHorizontal: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED"
    textAlignVertical: "TOP" | "CENTER" | "BOTTOM"
    textAutoResize: "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT"
    paragraphIndent: number
    paragraphSpacing: number
    autoRename: boolean

    textStyleId: string | PluginAPI['mixed']
    fontSize: number | PluginAPI['mixed']
    fontName: FontName | PluginAPI['mixed']
    textCase: TextCase | PluginAPI['mixed']
    textDecoration: TextDecoration | PluginAPI['mixed']
    letterSpacing: LetterSpacing | PluginAPI['mixed']
    lineHeight: LineHeight | PluginAPI['mixed']
    hyperlink: HyperlinkTarget | null | PluginAPI['mixed']

    characters: string
    insertCharacters(start: number, characters: string, useStyle?: "BEFORE" | "AFTER"): void
    deleteCharacters(start: number, end: number): void

    getRangeFontSize(start: number, end: number): number | PluginAPI['mixed']
    setRangeFontSize(start: number, end: number, value: number): void
    getRangeFontName(start: number, end: number): FontName | PluginAPI['mixed']
    setRangeFontName(start: number, end: number, value: FontName): void
    getRangeTextCase(start: number, end: number): TextCase | PluginAPI['mixed']
    setRangeTextCase(start: number, end: number, value: TextCase): void
    getRangeTextDecoration(start: number, end: number): TextDecoration | PluginAPI['mixed']
    setRangeTextDecoration(start: number, end: number, value: TextDecoration): void
    getRangeLetterSpacing(start: number, end: number): LetterSpacing | PluginAPI['mixed']
    setRangeLetterSpacing(start: number, end: number, value: LetterSpacing): void
    getRangeLineHeight(start: number, end: number): LineHeight | PluginAPI['mixed']
    setRangeLineHeight(start: number, end: number, value: LineHeight): void
    getRangeHyperlink(start: number, end: number): HyperlinkTarget | null | PluginAPI['mixed']
    setRangeHyperlink(start: number, end: number, value: HyperlinkTarget | null): void
    getRangeFills(start: number, end: number): Paint[] | PluginAPI['mixed']
    setRangeFills(start: number, end: number, value: Paint[]): void
    getRangeTextStyleId(start: number, end: number): string | PluginAPI['mixed']
    setRangeTextStyleId(start: number, end: number, value: string): void
    getRangeFillStyleId(start: number, end: number): string | PluginAPI['mixed']
    setRangeFillStyleId(start: number, end: number, value: string): void
  }

  interface ComponentSetNode extends BaseFrameMixin, PublishableMixin {
    readonly type: "COMPONENT_SET"
    clone(): ComponentSetNode
    readonly defaultVariant: ComponentNode
  }

  interface ComponentNode extends DefaultFrameMixin, PublishableMixin {
    readonly type: "COMPONENT"
    clone(): ComponentNode
    createInstance(): InstanceNode
  }

  interface InstanceNode extends DefaultFrameMixin {
    readonly type: "INSTANCE"
    clone(): InstanceNode
    mainComponent: ComponentNode | null
    swapComponent(componentNode: ComponentNode): void
    detachInstance(): FrameNode
    scaleFactor: number
  }

  interface BooleanOperationNode extends DefaultShapeMixin, ChildrenMixin, CornerMixin {
    readonly type: "BOOLEAN_OPERATION"
    clone(): BooleanOperationNode
    booleanOperation: "UNION" | "INTERSECT" | "SUBTRACT" | "EXCLUDE"

    expanded: boolean
  }

  type BaseNode =
    DocumentNode |
    PageNode |
    SceneNode

  type SceneNode =
    SliceNode |
    FrameNode |
    GroupNode |
    ComponentSetNode |
    ComponentNode |
    InstanceNode |
    BooleanOperationNode |
    VectorNode |
    StarNode |
    LineNode |
    EllipseNode |
    PolygonNode |
    RectangleNode |
    TextNode

  type NodeType =
    "DOCUMENT" |
    "PAGE" |
    "SLICE" |
    "FRAME" |
    "GROUP" |
    "COMPONENT_SET" |
    "COMPONENT" |
    "INSTANCE" |
    "BOOLEAN_OPERATION" |
    "VECTOR" |
    "STAR" |
    "LINE" |
    "ELLIPSE" |
    "POLYGON" |
    "RECTANGLE" |
    "TEXT"

  ////////////////////////////////////////////////////////////////////////////////
  // Styles
  type StyleType = "PAINT" | "TEXT" | "EFFECT" | "GRID"

  interface BaseStyle extends PublishableMixin {
    readonly id: string
    readonly type: StyleType
    name: string
    remove(): void
  }

  interface PaintStyle extends BaseStyle {
    type: "PAINT"
    paints: ReadonlyArray<Paint>
  }

  interface TextStyle extends BaseStyle {
    type: "TEXT"
    fontSize: number
    textDecoration: TextDecoration
    fontName: FontName
    letterSpacing: LetterSpacing
    lineHeight: LineHeight
    paragraphIndent: number
    paragraphSpacing: number
    textCase: TextCase
  }

  interface EffectStyle extends BaseStyle {
    type: "EFFECT"
    effects: ReadonlyArray<Effect>
  }

  interface GridStyle extends BaseStyle {
    type: "GRID"
    layoutGrids: ReadonlyArray<LayoutGrid>
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Other

  interface Image {
    readonly hash: string
    getBytesAsync(): Promise<Uint8Array>
  }
  } // declare global

  export {}
