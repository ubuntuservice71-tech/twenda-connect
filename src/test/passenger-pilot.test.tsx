import {render,screen,fireEvent,waitFor,cleanup} from "@testing-library/react";
import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {PassengerPreview} from "../components/passenger-preview";
const {command}=vi.hoisted(()=>({command:vi.fn()}));
vi.mock("../components/pilot-rides",()=>({pilotCommand:command}));
beforeEach(()=>{command.mockReset();command.mockResolvedValue({id:"test"});});
afterEach(cleanup);
function fill(origin:string,destination:string,price:string){fireEvent.change(screen.getByPlaceholderText("Usar a minha localização"),{target:{value:origin}});fireEvent.change(screen.getByPlaceholderText("Para onde vais?"),{target:{value:destination}});fireEvent.change(screen.getByLabelText("Quanto queres pagar?"),{target:{value:price}});}
describe("Passenger pilot request",()=>{
 it("keeps a single map available and collapses the booking sheet without losing input",()=>{render(<PassengerPreview/>);fill("A","B","150");expect(screen.getAllByRole("button",{name:"Abrir mapa Geoapify"})).toHaveLength(1);fireEvent.click(screen.getByRole("button",{name:"Para onde vamos?"}));expect(screen.getByRole("button",{name:"Para onde vamos?"})).toHaveAttribute("aria-expanded","false");fireEvent.click(screen.getByRole("button",{name:"Para onde vamos?"}));expect(screen.getByLabelText("Quanto queres pagar?")).toHaveValue("150");fireEvent.click(screen.getByRole("button",{name:/Rever proposta/}));expect(screen.getAllByRole("button",{name:"Abrir mapa Geoapify"})).toHaveLength(1);});
 it("rejects empty, equal and out-of-range routes or prices",()=>{render(<PassengerPreview/>);const next=screen.getByRole("button",{name:/Rever proposta/});expect(next).toBeDisabled();fill("A","A","150");expect(next).toBeDisabled();fill("A","B","10000000.01");expect(next).toBeDisabled();fill("A","B","150,25");expect(next).toBeEnabled();});
 it("allows review but blocks a guest from submitting",()=>{render(<PassengerPreview/>);fill("A","B","150");fireEvent.click(screen.getByRole("button",{name:/Rever proposta/}));expect(screen.getByRole("button",{name:"Registar pedido-piloto"})).toBeDisabled();expect(command).not.toHaveBeenCalled();});
 it("sends a motorcycle proposal in minor currency units",async()=>{const done=vi.fn();render(<PassengerPreview canSubmit onSubmitted={done}/>);fill("A","B","150,25");fireEvent.click(screen.getByRole("button",{name:/Motociclo/}));fireEvent.click(screen.getByRole("button",{name:/Rever proposta/}));fireEvent.click(screen.getByRole("button",{name:"Registar pedido-piloto"}));await waitFor(()=>expect(done).toHaveBeenCalledOnce());expect(command).toHaveBeenCalledWith({action:"request",origin:"A",destination:"B",vehicle_kind:"motorcycle",price_minor:15025,pickup_reference:null});});
});
