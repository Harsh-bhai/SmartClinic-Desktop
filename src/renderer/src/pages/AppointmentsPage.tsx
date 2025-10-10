// import { DataTable } from '@/components/data-table'
import DataTable from '@/components/origin-data-table'

const AppointmentsPage = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* <DataTable data={data} /> */}
      <DataTable/>
    </div>
  )
}

export default AppointmentsPage