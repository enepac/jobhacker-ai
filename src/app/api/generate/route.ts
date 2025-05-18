import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const { jobDescription, action } = await req.json()

  let prompt = ''

  switch (action) {
    case 'Tailor Resume':
      prompt = `You're a resume expert. Given this job description:\n\n${jobDescription}\n\nWrite 3 tailored resume bullet points that highlight relevant skills and results.`
      break

    case 'Generate Cover Letter':
      prompt = `You're a career coach. Based on this job description:\n\n${jobDescription}\n\nWrite a personalized, concise cover letter.`
      break

    case 'Analyze Job Description':
      prompt = `You're a job description analyst. Analyze the following JD:\n\n${jobDescription}\n\nReturn:\n1. Key skills\n2. Responsibilities\n3. Red flags\n4. How to stand out.`
      break

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })

    const result = response.choices[0].message?.content
    return NextResponse.json({ result })
  } catch (error) {
    console.error('[OPENAI_ERROR]', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
