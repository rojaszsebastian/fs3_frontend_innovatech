export default function SidebarComponent() {

    return (

        <div className="sidebar vh-100 p-3 border-end">
            <h5>Módulos</h5>

            <ul className="nav flex-column">

                <li className="nav-item">
                    <a href="/" className="nav-link">
                        Resumen
                    </a>
                </li>

                <li className="nav-item">
                    <a href="/" className="nav-link">
                        Recursos Humanos
                    </a>
                </li>

                <li className="nav-item">
                    <a href="/" className="nav-link">
                        Proyectos
                    </a>
                </li>

            </ul>

        </div>
    );
}