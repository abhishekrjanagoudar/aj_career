\LoadClass[14pt]{extreport}

\usepackage{ifthen}
\usepackage[english]{babel}
\usepackage[utf8x]{inputenc}
\usepackage{geometry}
\usepackage{array}
\usepackage{enumitem}
\usepackage[colorlinks=true,urlcolor=accentcolor,linkcolor=accentcolor]{hyperref}
\usepackage{xltabular}
\usepackage{graphicx}
\usepackage{outlines}
\usepackage[dvipsnames,svgnames,x11names]{xcolor}

% ── Accent colour ── change one line to retheme the whole CV
\definecolor{accentcolor}{RGB}{30, 90, 160}   % steel blue

\setlist[itemize]{leftmargin=*}
\linespread{1.15}
\geometry{a4paper,
    left={0.5in},
    top={0.4in}, 
    right={0.5in},
    bottom={0.4in}
}
\newcommand\clink[1]{{\usefont{T1}{lmtt}{m}{n} #1 }}
\pagenumbering{gobble}
\newenvironment{csection}[2]{
    {\color{accentcolor}\textbf{#1}}
    \vspace{0.15cm}
    {\color{accentcolor}\hrule}
    {#2}
}{}
\newenvironment{frcontent}[4]{
    {
        \textbf{#1} \leavevmode\newline
        {\footnotesize	
            \ifthenelse{\equal{#2}{}}{}{{#2 \leavevmode\newline}}
            \ifthenelse{\equal{#3}{}}{}{{#3 \leavevmode\newline}}
            \ifthenelse{\equal{#4}{}}{}{{\textit{#4}}}
        }
    }
}{}
% \documentclass[10pt,a4paper,showtrims]{memoir}
% \trimFrame  
% \settrimmedsize{210mm}{145mm}{*} 
% \settrims{20mm}{34mm}