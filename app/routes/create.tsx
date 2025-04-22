
import { CreateSessionForm } from "~/components/create/CreateSessionForm";

export default function Create() {

    return (
        <div className="container mx-auto root">
          <h1 className="text-6xl font-thin text-slate-300 py-12">Watch Party</h1>
          <div className="flex items-center w-full">
            <div className="flex-none flex flex-col w-full gap-4">
              <CreateSessionForm />
              
            </div>
          </div>
        </div>
      );
}