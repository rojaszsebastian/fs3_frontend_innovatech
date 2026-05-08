export default function EmployeeCapacityCard({ employee }) {

    return (

        <div className="card shadow-sm">

            <div className="card-body">

                <h5 className="card-title">
                    Recursos Humanos
                </h5>

                <p>
                    Empleado: {employee?.nombre || "Sin datos"}
                </p>

                <p>
                    Cargo: {employee?.cargo || "Sin datos"}
                </p>

                <p>
                    Capacity: {employee?.capacity || 0}
                </p>

            </div>

        </div>
    );
}