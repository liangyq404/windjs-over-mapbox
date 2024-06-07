precision mediump float;

attribute vec2 a_pos;

varying vec2 v_tex_pos;

// void main(){
    //     // Scale the vertex positions to show only the top-left quarter
    //     // vec2 scaled_pos=a_pos*1.;
    
    //     // Pass the scaled position to the varying variable
    //     v_tex_pos=scaled_pos;
    
    //     // Apply the scaled position to gl_Position
    //     gl_Position=vec4(scaled_pos*2.-1.,0.,1.);
// }

// void main(){
    //     // Scale the vertex positions to zoom in on the top-left quarter
    //     vec2 scaled_pos=a_pos*.5+.5;
    
    //     // Pass the scaled position to the varying variable
    //     v_tex_pos=scaled_pos;
    
    //     // Apply the scaled position to gl_Position
    //     gl_Position=vec4(scaled_pos*2.-1.,0.,1.);
// }

// void main(){
    
    //     vec2 scaled_pos=a_pos*.5;
    
    //     v_tex_pos=scaled_pos;
    
    //     gl_Position=vec4(scaled_pos*2.-1.,0.,1.);
// }
void main(){
    v_tex_pos=a_pos;
    gl_Position=vec4(1.-2.*a_pos,0,1);
}