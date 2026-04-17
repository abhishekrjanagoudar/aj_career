\documentclass[14pt]{extreport}

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

% --- Improved Professional Color Palette ---
\definecolor{primarycolor}{RGB}{20, 50, 100}   % Deep Navy (Headers & Companies)
\definecolor{secondarycolor}{RGB}{100, 100, 100} % Slate Grey (Dates & Locations)
\definecolor{accentcolor}{RGB}{30, 90, 160}    % Steel Blue (Links)

\setlist[itemize]{leftmargin=*}
\linespread{1.15}
\geometry{a4paper,
    left={0.5in},
    top={0.4in}, 
    right={0.5in},
    bottom={0.5in}
}
\newcommand\clink[1]{{\usefont{T1}{lmtt}{m}{n} #1 }}
\pagenumbering{gobble}

% Updated Section Header with better color and line weight
\newenvironment{csection}[2]{
    \vspace{0.15cm}
    {\color{primarycolor}\textbf{\MakeUppercase{#1}}}
    \vspace{0.10cm}
    {\color{primarycolor}\hrule height 0.8pt}
    \vspace{0.15cm}
    {#2}
}{}

\begin{document}
\fontfamily{ppl}\selectfont
\noindent
\begin{tabularx}{\linewidth}{@{}m{0.75\textwidth} m{0.25\textwidth}@{}}
{
    \LARGE {\color{primarycolor}\textbf{Abhishek Janagoudar}} \newline
    \small{
        Automation \& Robotics Master's Student at Hochschule Darmstadt\newline
        \clink{
            \textbf{·}
            \href{mailto:abhirj1999@gmail.com}{abhirj1999@gmail.com} \textbf{·}
            \href{tel:+4915510610381}{+49 015510610381} \textbf{·}
            Stuttgart, 70569\newline
            \textbf{·}
            \href{https://www.linkedin.com/in/abhishek-janagoudar-478a611a4}{LinkedIn} \textbf{·}
            \href{https://github.com/abhishekrjanagoudar/}{GitHub} \textbf{·}
            Available immediately on-site
        }
    }
}
& 
{
    \hfill\includegraphics[width=3.5cm]{mypic.png}
}
\end{tabularx}

\vspace{-0.8cm}

\noindent\csection{Profile}{\footnotesize
    \begin{itemize}[itemsep=0pt,parsep=0pt,topsep=2pt]
        \item Automation and Robotics Master's student with hands-on experience in ROS 2, SLAM, and LiDAR-based perception. Skilled in building autonomous mobile robot systems, digital twins (AAS), and PLC-based safety systems. With programming skills in Python and C++. Looking for working student or internship roles in robotics, automation, and intelligent systems.
    \end{itemize}
}

\noindent\csection{EXPERIENCE}{\footnotesize
    \begin{itemize}[itemsep=4pt,parsep=0pt,topsep=2pt]
        \item \textbf{\color{primarycolor} BÄR Automation GmbH} \hfill \textbf{11/2025 -- 04/2026 (6 M)}\newline{\footnotesize \textbf{Mobile Robotics Development Intern (Full-time Mandatory)} \hfill {Stuttgart, Germany}}
        \begin{itemize}[itemsep=0pt,parsep=0pt,topsep=1pt]
            \footnotesize
            \item Implemented a ROS 2-based SLAM and localization pipeline (SLAM Toolbox, Cartographer, AMCL) under severe odometry drift (~8°/360°), improving map consistency and localization robustness
            \item Engineered an offline ROS bag evaluation workflow with accelerated playback (5–10×), reducing SLAM tuning cycles from ~45 minutes to a few minutes and enabling hardware-aware performance testing
            \item Designed and implemented a programmatic Asset Administration Shell (AAS v3.1) generation pipeline with validation of 160+ standardized attributes, ensuring schema-compliant digital twin creation
            \item Built a VDA 5050–compliant integration layer using MQTT to stream AGV state data into AAS submodels (AssetLocation, TimeSeries), enabling real-time synchronization between physical systems and digital twins
        \end{itemize}

        \item \textbf{\color{primarycolor} J. Ray McDermott Engineering Services Private Ltd} \hfill \textbf{02/2024 -- 08/2024 (7 M)}\newline{\footnotesize \textbf{Associate System Engineer -- AVEVA Electrical Admin V12} \hfill {Chennai, India}}
        \begin{itemize}[itemsep=0pt,parsep=0pt,topsep=1pt]
            \footnotesize
             \item Configured data-driven workflows to generate 50+ engineering outputs
            \item Maintained structured engineering data models for consistency and scalability
            \item Supported digitalization of electrical design through automated documentation
        \end{itemize}

        \item \textbf{\color{primarycolor} Infosys Ltd.} \hfill \textbf{09/2021 -- 02/2024 (30 M)}\newline{\footnotesize \textbf{Senior System Engineer -- AVEVA Engineering V15 Electrical \& Instrumentation Developer} \hfill {Mysore, India}}
        \begin{itemize}[itemsep=0pt,parsep=0pt,topsep=1pt]
            \footnotesize
            \item Managed AVEVA Engineering platform using structured data models (classes, attributes, associations) for electrical and instrumentation systems
            \item Automated generation of 50+ deliverables (load lists, cable schedules, datasheets) via rule-based workflows
            \item Led Agile Scrum activities and coordinated sprint execution, and mentored 9 engineers
            \item Produced technical documentation for data structures, workflows, and user guidelines
        \end{itemize}
        \item \textbf{\color{primarycolor} Arkay Energy Ltd.} \hfill \textbf{07/2019}\newline{\footnotesize \textbf{Electrical Operations and Maintenance Intern} \hfill {TN, India}}\newline{\footnotesize Supported substation commissioning, O\&M tasks, and industrial safety practices.}

        \item \textbf{\color{primarycolor} Larsen and Toubro Electricals} \hfill \textbf{06/2019}\newline{\footnotesize \textbf{Electrical Commissioning Intern} \hfill {Khargone, India}}\newline{\footnotesize Assisted in electrical system setup, testing, and troubleshooting.}
    \end{itemize}
}

\noindent\csection{EDUCATION}{\footnotesize
    \begin{itemize}[itemsep=4pt,parsep=0pt,topsep=2pt]
        \item
        \begin{tabularx}{\linewidth}{@{}Xr@{}}
            \textbf{\color{primarycolor} Master of Science (M.Sc) | Electrical and Information Technology} & \textbf{(09/2024 -- present)} \\
        \end{tabularx}
        {\footnotesize Darmstadt University of Applied Sciences, {Darmstadt, Germany}\newline Modules: Industrial Robotics, Safety in Industrial Automation, Computer Vision, Industry 4.0 / IIoT, Advanced Programming Techniques, Human Machine Interface}

        \item
        \begin{tabularx}{\linewidth}{@{}Xr@{}}
            \textbf{\color{primarycolor} Bachelor of Engineering (B.E) | Electrical and Electronics} & \textbf{(07/2017 -- 09/2021)} \\
        \end{tabularx}
        {\footnotesize The National Institute of Engineering, {Mysore, India}}
    \end{itemize}
}
\newpage
\noindent\csection{SKILLS}{\footnotesize
    \begin{itemize}[itemsep=1pt,parsep=0pt,topsep=2pt]
        \item \textbf{Robotics:} ROS 2 (Humble/Foxy), SLAM (Toolbox, Cartographer, AMCL), Navigation 2, VDA 5050, Robot Kinematics, Gazebo, RViz.
        \item \textbf{Vision \& AI:} OpenCV, LiDAR \& Point Cloud Processing, Object Detection \& Segmentation, Multi-Object Tracking, LLMs, Prompt Engineering.
        \item \textbf{IIoT \& Automation:} TIA Portal (S7-1516F), OPC UA, MQTT, Node-RED, Digital Twins (AAS v3.1), SISTEMA.
        \item \textbf{Programming \& Tools:} Python, C++, Linux (Ubuntu), Git, Docker, MATLAB/Simulink, VS Code, AVEVA Engineering v15.x, AVEVA Electrical v12.
        \item \textbf{Soft Skills:} Agile/Scrum, Technical Mentoring, Cross-team Coordination, CI/CD, Jira, Rally.
    \end{itemize}
}

\noindent\csection{PROJECTS}{\footnotesize
    \begin{itemize}[itemsep=4pt,parsep=0pt,topsep=2pt]
        \item \textbf{\color{primarycolor} BAER AAS Tools -- Digital Twin Platform (ARENA2036)} \href{https://github.com/abhishekrjanagoudar/aas_arena}{[GitHub]}\newline
        {\footnotesize Developed digital twins of AGVs using Asset Administration Shell (AAS v3.1) for static and dynamic assets.
        \begin{itemize}[itemsep=0pt,parsep=0pt,topsep=1pt]
            \item Engineered digital twins for static and dynamic assets using Asset Administration Shell (AAS v3.1) aligned with IDTA standards
            \item Designed a Python-based generation pipeline to create and validate 160+ standardized attributes, eliminating manual schema errors
            \item Orchestrated integration with the Eclipse BaSyx registry via REST APIs for centralized asset management
            \item Enabled interoperability with VDA 5050 for AGV fleet communication and standardized data exchange
            \item Developed a web-based dashboard for monitoring asset states and synchronization status
            \item Facilitated export of simulation-ready environments (Gazebo .sdf) for virtual validation
        \end{itemize}}

        \item \textbf{\color{primarycolor} LiDAR Mapping \& Indoor Scene Analysis}\newline
        {\footnotesize Implemented ROS 2 pipeline for LiDAR mapping, plane segmentation, and environment reconstruction.}

        \item \textbf{\color{primarycolor} UR5 / UR10 Kinematics}\newline
        {\footnotesize Modelled robot kinematics in MATLAB/Simulink.}

        \item \textbf{\color{primarycolor} Advanced Programming Technique Lab Projects}\newline
        {\footnotesize Built console-based games (Battleship and Reversi) and a university enrollment database system in C++, applying OOP, game logic, and data management.}

        \item \textbf{\color{primarycolor} Safety in Industrial Automation Lab}\newline
        {\footnotesize Programmed Siemens S7-1516F safety PLC and ET200SP modules in TIA Portal, implementing safety logic (ESTOP1, TWO\_H\_EN, SFDOOR, FDBACK) and validated compliance with EN ISO 13849-1 using SISTEMA (PL verification, black box testing).}
    \end{itemize}
}

\noindent\csection{Languages}{\footnotesize
    \begin{itemize}[itemsep=0pt,parsep=0pt,topsep=2pt]
        \item \textbf{English} -- IELTS 7.5 (C1) \textbf{·} \textbf{Deutsch} -- A2.2 \textbf{·} \textbf{Hindi} -- Native \textbf{·} \textbf{Kannada} -- Native
    \end{itemize}
}

\end{document}


Below is resume cls

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
    bottom={0.5in}
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