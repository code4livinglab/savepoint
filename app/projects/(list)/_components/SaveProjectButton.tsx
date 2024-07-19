import Link from "next/link"

const SaveProjectButton = async () => {
  return (
    <div className="absolute z-10 bottom-0 right-0 m-5">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <Link href="/projects/new">セーブ</Link>
      </button>
    </div>
  )
}

export default SaveProjectButton
