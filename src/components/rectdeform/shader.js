export const vertShader = 'precision mediump float;\n' +
'precision mediump int;\n' +
'attribute vec3 position;\n' +
'attribute vec4 color;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
' gl_Position = vec4(position, 1.0) ;\n' +
// vec4 important! gl_Position是vec4
' v_Color = color;\n' +
'}\n'
export const rectVertShader = 'precision mediump float;\n' +
'precision mediump int;\n' +
'attribute vec3 position;\n' +
'attribute vec4 color;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
' gl_Position = vec4(position, 1.0) ;\n' +
// vec4 important! gl_Position是vec4
' v_Color = vec4(color[0], color[1], color[2], 0.1);\n' +
'}\n'

export const fragShader = 'precision mediump float;\n' +
'precision mediump int;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
' gl_FragColor = v_Color;\n' +
'}\n'
