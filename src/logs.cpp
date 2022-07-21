#include <logs.h>

RingBuffer::RingBuffer(int cap) : buffer(cap), first(0), last(0), sz(0) {}

bool RingBuffer::empty() const { return sz == 0; }
bool RingBuffer::full() const { return sz == buffer.size(); }

void RingBuffer::push(String str)
{
    if (last >= buffer.size())
        last = 0;
    buffer[last] = str;
    ++last;
    if (full())
        first = (first + 1) % buffer.size();
    else
        ++sz;
}
String RingBuffer::print() const
{
    String logs = "";
    if (first < last)
        for (size_t i = first; i < last; ++i)
        {
            logs += (buffer[i] + "<br>");
        }
    else
    {
        for (size_t i = first; i < buffer.size(); ++i)
        {
            logs += (buffer[i] + "<br>");
        }
        for (size_t i = 0; i < last; ++i)
        {
            logs += (buffer[i] + "<br>");
        }
    }
    return logs;
}
RingBuffer circle(10);
RingBuffer debugBuffer(50);

void logOutput(String str)
{
    circle.push(str);
    Serial.println(str);
}

void debugOutput(String str)
{
    debugBuffer.push((String) "DEBUG: " + str);
    Serial.println((String) "DEBUG: " + str);
}